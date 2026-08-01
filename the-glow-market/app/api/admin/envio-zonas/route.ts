import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { leerZonas } from '@/lib/envios/server'
import { describirCobertura, PROVINCIAS, slugProvincia } from '@/lib/envios/zonas'
import { limpiarZona, validarZona } from '@/lib/envios/validar'

/** Las zonas en el orden en que se evalúan, que es como se listan en el panel. */
export async function GET() {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  // leerZonas ya devuelve el orden de evaluación, que es el que se muestra en el panel.
  const zonas = await leerZonas()
  return NextResponse.json({
    zonas: zonas.map((z) => ({
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
 * Guarda el orden en que quedaron las zonas después de arrastrarlas. Recibe los ids en el
 * orden nuevo y escribe la posición de cada una, que es la que usa el matcheo.
 */
export async function PATCH(request: Request) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const body = await request.json().catch(() => ({}))
  const ids: string[] = Array.isArray(body.ids) ? body.ids : []
  if (ids.length === 0) {
    return NextResponse.json({ error: 'No llegó el orden nuevo' }, { status: 400 })
  }

  const zonas = await leerZonas()
  const movibles = new Set(zonas.filter((z) => z.tipo === 'normal').map((z) => z.id))

  // Los descartes no se mueven: su lugar es el final, y arriba taparían a todo lo demás.
  const aGuardar = ids.filter((id) => movibles.has(id))

  for (let i = 0; i < aGuardar.length; i++) {
    const { error } = await auth.db
      .from('envio_zonas')
      .update({ orden: i, updated_at: new Date().toISOString() })
      .eq('id', aGuardar[i])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Detrás de cualquier zona propia, y en su orden fijo entre sí.
  for (const [tipo, posicion] of [['resto-bsas', 9000], ['resto-pais', 9001]] as const) {
    await auth.db.from('envio_zonas').update({ orden: posicion }).eq('tipo', tipo)
  }

  return NextResponse.json({ ok: true, guardadas: aGuardar.length })
}
