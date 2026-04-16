import { NextResponse } from 'next/server'
import { createPreference } from '@/lib/mercadopago'
import { createClient } from '@/lib/supabase/server'
import type { CartItem, DatosEnvio } from '@/types'

export async function POST(request: Request) {
  try {
    const { items, datosEnvio }: { items: CartItem[]; datosEnvio: DatosEnvio } =
      await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    // Crear orden en Supabase
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const total = items.reduce(
      (acc: number, item: CartItem) => acc + item.precio * item.quantity,
      0
    )

    const { data: orden, error: ordenError } = await supabase
      .from('ordenes')
      .insert({
        user_id: user?.id || null,
        estado: 'pendiente',
        total,
        items: items.map((item) => ({
          id: item.id,
          slug: item.slug,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.quantity,
          imagen_url: item.imagen_url,
        })),
        datos_envio: datosEnvio,
      })
      .select()
      .single()

    if (ordenError || !orden) {
      console.error('Error creando orden:', ordenError)
      return NextResponse.json({ error: 'Error al crear la orden' }, { status: 500 })
    }

    // Crear preferencia de MercadoPago
    const preference = await createPreference(items, orden.id)

    // Actualizar orden con ID de preferencia
    await supabase
      .from('ordenes')
      .update({ mp_preference_id: preference.id })
      .eq('id', orden.id)

    return NextResponse.json({
      preference_id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    })
  } catch (error) {
    console.error('Error en create-preference:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
