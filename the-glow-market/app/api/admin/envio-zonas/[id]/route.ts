import { NextResponse } from 'next/server'
import { getAdminOr401 } from '@/lib/admin/auth'
import { leerZonas } from '@/lib/envios/server'
import { limpiarZona, validarZona } from '@/lib/envios/validar'

type Contexto = { params: Promise<{ id: string }> }

/** Guarda los cambios de una zona. En los descartes solo se toca el precio y el texto. */
export async function PUT(request: Request, { params }: Contexto) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { id } = await params
  const zonas = await leerZonas()
  const actual = zonas.find((z) => z.id === id)
  if (!actual) {
    return NextResponse.json({ error: 'Esa zona no existe' }, { status: 404 })
  }

  const esDescarte = actual.tipo !== 'normal'
  const zona = limpiarZona(await request.json().catch(() => ({})))
  const error = validarZona(
    zona,
    zonas.filter((z) => z.id !== id),
    esDescarte,
  )
  if (error) return NextResponse.json({ error }, { status: 400 })

  // Los descartes cubren lo que no cubre nadie: si se les pudiera elegir región, dejarían de
  // ser la red que atrapa todo y habría direcciones sin zona.
  const cambios = esDescarte
    ? {
        nombre: zona.nombre,
        descripcion: zona.descripcion,
        precio: zona.precio,
        activo: zona.activo,
        envio_gratis: zona.envio_gratis,
        envio_gratis_desde: zona.envio_gratis_desde,
      }
    : zona

  const { error: dbError } = await auth.db
    .from('envio_zonas')
    .update({ ...cambios, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** Borra una zona. Los descartes no se borran: sin ellos quedarían direcciones sin zona. */
export async function DELETE(_request: Request, { params }: Contexto) {
  const auth = await getAdminOr401()
  if (!auth.ok) return auth.response

  const { id } = await params
  const zona = (await leerZonas()).find((z) => z.id === id)
  if (!zona) {
    return NextResponse.json({ error: 'Esa zona no existe' }, { status: 404 })
  }
  if (zona.tipo !== 'normal') {
    return NextResponse.json(
      { error: 'Esta zona no se puede borrar: es la que cubre todo lo que no cubren las demás.' },
      { status: 400 },
    )
  }

  const { error } = await auth.db.from('envio_zonas').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
