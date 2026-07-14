import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPayment } from '@/lib/mercadopago'
import { sendOrderConfirmation } from '@/lib/email'
import type { MPWebhookData } from '@/types'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body: MPWebhookData = await request.json()

    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data.id
    const payment = await getPayment(paymentId)

    if (!payment || payment.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const orderId = payment.external_reference

    const { data: orden, error: ordenError } = await adminClient
      .from('ordenes')
      .update({
        estado: 'aprobado',
        mp_payment_id: String(paymentId),
      })
      .eq('id', orderId)
      .select()
      .single()

    if (ordenError || !orden) {
      console.error('Error actualizando orden:', ordenError)
      return NextResponse.json({ error: 'Error actualizando orden' }, { status: 500 })
    }

    // Descontar stock de productos
    if (orden.items) {
      for (const item of orden.items) {
        const { data: producto } = await adminClient
          .from('productos')
          .select('id, stock')
          .eq('id', item.id)
          .single()

        if (producto && producto.stock > 0) {
          const nuevoStock = Math.max(0, producto.stock - (item.cantidad || 1))
          await adminClient
            .from('productos')
            .update({ stock: nuevoStock })
            .eq('id', producto.id)
        }
      }
    }

    // Si hay user_id, verificar si compró algún curso
    if (orden.user_id && orden.items) {
      for (const item of orden.items) {
        const { data: curso } = await adminClient
          .from('cursos')
          .select('id')
          .eq('id', item.id)
          .single()

        if (curso) {
          await adminClient
            .from('accesos_curso')
            .upsert({
              user_id: orden.user_id,
              curso_id: curso.id,
              activo: true,
            })
        }
      }
    }

    // Enviar email de confirmación
    try {
      const { data: usuario } = await adminClient.auth.admin.getUserById(orden.user_id || '')
      const email = usuario?.user?.email || payment.payer?.email

      if (email) {
        const nombreCliente = usuario?.user?.user_metadata?.nombre || email.split('@')[0]
        await sendOrderConfirmation({
          to: email,
          nombreCliente,
          ordenId: orden.id,
          items: orden.items || [],
          total: orden.total || 0,
        })
      }
    } catch (emailError) {
      console.error('Error enviando email:', emailError)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
