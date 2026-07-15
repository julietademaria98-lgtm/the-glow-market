import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPayment } from '@/lib/mercadopago'
import { sendOrderConfirmation } from '@/lib/email'
import type { MPWebhookData } from '@/types'
import { createHmac } from 'crypto'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifyWebhookSignature(request: Request, rawBody: string, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return true

  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')

  if (!xSignature) return false

  const parts = Object.fromEntries(xSignature.split(',').map(p => p.split('=')))
  const ts = parts['ts']
  const v1 = parts['v1']

  if (!ts || !v1) return false

  const signedTemplate = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expectedSignature = createHmac('sha256', secret).update(signedTemplate).digest('hex')

  return expectedSignature === v1
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const body: MPWebhookData = JSON.parse(rawBody)

    if (!verifyWebhookSignature(request, rawBody, body.data?.id)) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

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

    let hasCurso = false
    let hasProductoFisico = false

    if (orden.items) {
      for (const item of orden.items) {
        const { data: curso } = await adminClient
          .from('cursos')
          .select('id')
          .eq('id', item.id)
          .single()

        if (curso) {
          hasCurso = true
          if (orden.user_id) {
            await adminClient
              .from('accesos_curso')
              .upsert({
                user_id: orden.user_id,
                curso_id: curso.id,
                activo: true,
              })
          }
        } else {
          hasProductoFisico = true
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
    }

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
          hasCurso,
          hasProductoFisico,
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
