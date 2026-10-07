export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createPreference } from '@/lib/mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CartItem } from '@/types'

const schema = z.object({
  items: z.array(z.object({ id: z.string().uuid(), quantity: z.number().int().min(1).max(20), precio: z.number().positive() })).min(1).max(50),
  datosEnvio: z.object({
    nombre: z.string().trim().min(2).max(100), apellido: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254).transform(v => v.toLowerCase()),
    telefono: z.string().min(8).max(40), provincia: z.string().max(100).optional(),
    ciudad: z.string().max(100).optional(), direccion: z.string().max(300).optional(),
    codigo_postal: z.string().max(20).optional(), notas: z.string().max(1000).optional(),
  }),
})

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Revisá los datos de contacto y el carrito.' }, { status: 400 })
    const { items: requested, datosEnvio } = parsed.data
    if (new Set(requested.map(i => i.id)).size !== requested.length) return NextResponse.json({ error: 'Hay productos repetidos en el carrito.' }, { status: 400 })
    const db = createAdminClient()
    const ids = requested.map(i => i.id)
    const [products, courses, suggestions] = await Promise.all([
      db.from('productos').select('*, imagenes:producto_imagenes(*)').eq('activo', true).in('id', ids),
      db.from('cursos').select('*').eq('activo', true).in('id', ids),
      db.from('productos').select('id').eq('activo', true).gt('stock', 0).order('destacado', { ascending: false }).limit(4),
    ])
    if (products.error || courses.error || suggestions.error) throw new Error('Catálogo no disponible')
    const suggested = new Set(suggestions.data?.map(p => p.id))
    const items: CartItem[] = []
    for (const input of requested) {
      const product = products.data?.find(p => p.id === input.id)
      const course = courses.data?.find(c => c.id === input.id)
      const entry = product || course
      if (!entry || (product && product.stock < input.quantity) || (course && input.quantity !== 1)) {
        return NextResponse.json({ error: 'Un artículo no está disponible en la cantidad seleccionada. Revisá tu carrito.' }, { status: 400 })
      }
      let price = Number(entry.precio_oferta ?? entry.precio)
      // Conservar el beneficio existente del 10% solo para sugerencias y un carrito con otro artículo.
      if (product && requested.length > 1 && suggested.has(product.id) && input.precio === Math.round(price * 0.9)) price = Math.round(price * 0.9)
      if (!Number.isFinite(price) || price <= 0 || Math.round(input.precio * 100) !== Math.round(price * 100)) {
        return NextResponse.json({ error: 'Cambió el precio de un artículo. Actualizá el carrito antes de pagar.' }, { status: 400 })
      }
      items.push({ id: entry.id, slug: entry.slug, nombre: product ? product.nombre : course.titulo,
        precio: price, quantity: input.quantity, tipo: product ? 'producto' : 'curso',
        imagen_url: product ? product.imagenes?.find((i: { es_principal: boolean }) => i.es_principal)?.url || product.imagenes?.[0]?.url || '' : course.imagen_url || '',
      })
    }
    if (items.some(i => i.tipo === 'producto') && (!datosEnvio.direccion || !datosEnvio.ciudad || !datosEnvio.provincia || !datosEnvio.codigo_postal)) {
      return NextResponse.json({ error: 'Completá la dirección de envío.' }, { status: 400 })
    }
    // El usuario se asocia tras el pago al EMAIL DE COMPRA, incluso si hay otra sesión abierta.
    const { data: order, error } = await db.from('ordenes').insert({
      user_id: null, estado: 'pendiente', total: items.reduce((sum, i) => sum + i.precio * i.quantity, 0),
      items: items.map(i => ({ id: i.id, slug: i.slug, nombre: i.nombre, precio: i.precio, cantidad: i.quantity, imagen_url: i.imagen_url })),
      datos_envio: datosEnvio,
    }).select('id').single()
    if (error || !order) throw new Error('No se pudo guardar la orden')
    const preference = await createPreference(items, order.id)
    const { error: saveError } = await db.from('ordenes').update({ mp_preference_id: preference.id }).eq('id', order.id)
    if (saveError) throw saveError
    return NextResponse.json({ preference_id: preference.id, init_point: preference.init_point, sandbox_init_point: preference.sandbox_init_point })
  } catch {
    return NextResponse.json({ error: 'No pudimos iniciar el pago. Intentá nuevamente.' }, { status: 500 })
  }
}
