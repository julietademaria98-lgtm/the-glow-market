import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { ZONAS, parsearCodigosPostales } from '@/lib/envios/zonas'

const IDS_VALIDOS = new Set(ZONAS.map((z) => z.id))
const EDITA_CP = new Set(ZONAS.filter((z) => z.editaCodigosPostales).map((z) => z.id))

/**
 * Lista las 26 zonas para el panel. Se arma sobre el catálogo de `zonas.ts` y no sobre lo
 * que haya en la base: si a una zona todavía le falta la fila, igual aparece en el panel
 * (vacía) en vez de desaparecer.
 */
export async function GET() {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { data, error } = await auth.db
    .from('envio_zonas')
    .select('id, nombre, descripcion, precio, activo, orden, codigos_postales')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const porId = new Map((data || []).map((z) => [z.id, z]))
  const zonas = ZONAS.map((z) => {
    const fila = porId.get(z.id)
    return {
      id: z.id,
      grupo: z.grupo,
      etiqueta: z.etiqueta,
      editaCodigosPostales: Boolean(z.editaCodigosPostales),
      codigosPostales: (fila?.codigos_postales ?? []).join(', '),
      nombre: fila?.nombre ?? '',
      descripcion: fila?.descripcion ?? '',
      precio: fila?.precio != null ? String(fila.precio) : '0',
      activo: fila?.activo ?? false,
    }
  })

  return NextResponse.json({ zonas })
}

/** Guarda las zonas que manda el panel. Ignora ids que no estén en el catálogo. */
export async function POST(request: Request) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const body = await request.json().catch(() => ({}))
  const entrada = Array.isArray(body.zonas) ? body.zonas : []

  interface ZonaEntrada {
    id: string
    nombre?: string
    descripcion?: string
    precio?: unknown
    activo?: boolean
    codigosPostales?: string
  }

  interface FilaZona {
    id: string
    nombre: string
    descripcion: string | null
    precio: number
    activo: boolean
    codigos_postales?: string[]
    updated_at: string
  }

  const filas: FilaZona[] = entrada
    .filter((z: ZonaEntrada) => z?.id && IDS_VALIDOS.has(z.id))
    .map((z: ZonaEntrada) => {
      const nombre = String(z.nombre ?? '').trim()
      const precio = Number(z.precio) || 0
      return {
        id: z.id,
        nombre,
        descripcion: String(z.descripcion ?? '').trim() || null,
        precio: precio < 0 ? 0 : precio,
        // Sin nombre no hay método que mostrar, así que no se puede dejar activa.
        activo: Boolean(z.activo) && nombre.length > 0,
        // Solo GBA y GBA2 tienen lista propia; en el resto la columna queda intacta.
        ...(EDITA_CP.has(z.id)
          ? { codigos_postales: parsearCodigosPostales(z.codigosPostales ?? '') }
          : {}),
        updated_at: new Date().toISOString(),
      }
    })

  if (filas.length === 0) {
    return NextResponse.json({ error: 'No hay zonas válidas para guardar' }, { status: 400 })
  }

  // Un CP en las dos listas haría que el precio dependa del orden de evaluación, así que se
  // rechaza antes de guardar en lugar de resolverlo en silencio.
  const listas = filas.filter(
    (f): f is FilaZona & { codigos_postales: string[] } => Array.isArray(f.codigos_postales),
  )
  if (listas.length === 2) {
    const [a, b] = listas
    const repetidos = a.codigos_postales.filter((cp) => b.codigos_postales.includes(cp))
    if (repetidos.length > 0) {
      return NextResponse.json(
        {
          error: `Estos códigos postales están en ${a.id.toUpperCase()} y en ${b.id.toUpperCase()} a la vez: ${repetidos.join(', ')}. Dejalos en una sola zona.`,
        },
        { status: 400 },
      )
    }
  }

  const { error } = await auth.db.from('envio_zonas').upsert(filas, { onConflict: 'id' })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, guardadas: filas.length })
}
