import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { ZONAS } from '@/lib/envios/zonas'

const IDS_VALIDOS = new Set(ZONAS.map((z) => z.id))

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
    .select('id, nombre, descripcion, precio, activo, orden')

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

  const filas = entrada
    .filter((z: { id?: string }) => z?.id && IDS_VALIDOS.has(z.id))
    .map((z: { id: string; nombre?: string; descripcion?: string; precio?: unknown; activo?: boolean }) => {
      const nombre = String(z.nombre ?? '').trim()
      const precio = Number(z.precio) || 0
      return {
        id: z.id,
        nombre,
        descripcion: String(z.descripcion ?? '').trim() || null,
        precio: precio < 0 ? 0 : precio,
        // Sin nombre no hay método que mostrar, así que no se puede dejar activa.
        activo: Boolean(z.activo) && nombre.length > 0,
        updated_at: new Date().toISOString(),
      }
    })

  if (filas.length === 0) {
    return NextResponse.json({ error: 'No hay zonas válidas para guardar' }, { status: 400 })
  }

  const { error } = await auth.db.from('envio_zonas').upsert(filas, { onConflict: 'id' })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, guardadas: filas.length })
}
