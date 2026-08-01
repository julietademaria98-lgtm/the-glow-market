import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { leerZonas } from '@/lib/envios/server'
import { describirCobertura, PROVINCIAS, slugProvincia } from '@/lib/envios/zonas'
import { limpiarZona, validarZona } from '@/lib/envios/validar'

/** Las zonas en el orden en que se evalúan, que es como se listan en el panel. */
export async function GET() {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const zonas = await leerZonas()
  return NextResponse.json({
    zonas: ordenarParaPanel(zonas).map((z) => ({
      ...z,
      codigosPostales: z.codigosPostales.join(', '),
      cobertura: describirCobertura(z),
      esDescarte: z.tipo !== 'normal',
    })),
    provincias: PROVINCIAS.map((p) => ({ slug: slugProvincia(p), nombre: p })),
  })
}

/** Crea una zona nueva. Los descartes ya existen y no se crean desde acá. */
export async function POST(request: Request) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const zona = limpiarZona(await request.json().catch(() => ({})))
  const error = validarZona(zona, await leerZonas(), false)
  if (error) return NextResponse.json({ error }, { status: 400 })

  const { data, error: dbError } = await auth.db
    .from('envio_zonas')
    .insert({ ...zona, id: crypto.randomUUID(), tipo: 'normal' })
    .select('id')
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id })
}

/**
 * Ordena como se evalúan: primero las de códigos postales, después las de provincia, y los
 * dos descartes al final. Así la lista del panel se lee de lo más chico a lo más grande.
 */
function ordenarParaPanel<T extends { tipo: string; codigosPostales: string[] }>(zonas: T[]): T[] {
  const peso = (z: T) => {
    if (z.tipo === 'resto-pais') return 3
    if (z.tipo === 'resto-bsas') return 2
    return z.codigosPostales.length > 0 ? 0 : 1
  }
  return [...zonas].sort((a, b) => peso(a) - peso(b))
}
