import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPayment } from '@/lib/mercadopago'
import type { MPWebhookData } from '@/types'

// Admin client con service role para escribir accesos
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body: MPWebhookData = await request.json()

    // Solo procesar pagos
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data.id
    const payment = await getPayment(paymentId)

    if (!payment || payment.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const orderId = payment.external_reference

    // Actualizar estado de la orden
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

    // Si hay user_id, verificar si compró algún curso
    if (orden.user_id && orden.items) {
      for (const item of orden.items) {
        // Verificar si el item es un curso
        const { data: curso } = await adminClient
          .from('cursos')
          .select('id')
          .eq('id', item.id)
          .single()

        if (curso) {
          // Crear acceso al curso
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

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
