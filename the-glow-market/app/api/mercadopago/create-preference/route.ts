import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createPreference } from '@/lib/mercadopago'
import { cotizarEnvio } from '@/lib/envios/server'
import { createClient } from '@/lib/supabase/server'
import type { CartItem, DatosEnvio } from '@/types'

export async function POST(request: Request) {
  try {
    const { items, datosEnvio }: { items: CartItem[]; datosEnvio: DatosEnvio } =
      await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    // El cliente con cookies solo se usa para saber quién compra (puede ser nadie).
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // La orden se escribe con service-role, como ya hace el webhook. RLS en `ordenes` solo
    // deja leer las propias (`user_id = auth.uid()`), así que un comprador sin cuenta no
    // podía hacer insert().select() y la compra fallaba con "violates row-level security".
    const db = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const subtotal = items.reduce(
      (acc: number, item: CartItem) => acc + item.precio * item.quantity,
      0
    )

    // El envío se recalcula acá y no se toma del cliente: es lo único que evita que alguien
    // mande un precio propio desde el navegador. Los cursos no se envían.
    const soloDigital = items.every((item) => item.tipo === 'curso')
    let costoEnvio = 0
    let envioZona: string | null = null

    if (!soloDigital) {
      const envio = await cotizarEnvio(
        datosEnvio?.provincia || '',
        datosEnvio?.codigo_postal || '',
      )
      if (!envio.disponible) {
        return NextResponse.json(
          { error: 'No hay envío disponible para esa dirección' },
          { status: 400 },
        )
      }
      costoEnvio = envio.precio
      envioZona = envio.zonaId
    }

    const total = subtotal + costoEnvio

    const { data: orden, error: ordenError } = await db
      .from('ordenes')
      .insert({
        user_id: user?.id || null,
        estado: 'pendiente',
        total,
        costo_envio: costoEnvio,
        envio_zona: envioZona,
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

    // Crear preferencia de MercadoPago (con el envío ya incluido)
    const preference = await createPreference(items, orden.id, costoEnvio)

    // Actualizar orden con ID de preferencia
    await db
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
