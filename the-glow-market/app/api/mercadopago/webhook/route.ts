export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual, randomUUID } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPayment } from '@/lib/mercadopago'
import { sendOrderConfirmation } from '@/lib/email'

function validSignature(request: Request, dataId: string) {
  const secret = process.env.MP_WEBHOOK_SECRET
  // Mercado Pago se consulta siempre en el servidor, aun sin secreto configurado.
  if (!secret) return true
  const parts = Object.fromEntries((request.headers.get('x-signature') || '').split(',').map(p => p.trim().split('=')))
  const requestId = request.headers.get('x-request-id')
  if (!parts.ts || !/^[a-f0-9]{64}$/i.test(parts.v1 || '') || !requestId) return false
  const digest = createHmac('sha256', secret)
    .update(`id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`).digest()
  return timingSafeEqual(digest, Buffer.from(parts.v1, 'hex'))
}

export async function POST(request: Request) {
  const db = createAdminClient()
  let orderId: string | undefined
  const lease = randomUUID()
  let claimed = false
  try {
    const body = await request.json()
    if (body.type !== 'payment') return NextResponse.json({ ok: true })
    const paymentId = String(body.data?.id || '')
    const signedId = new URL(request.url).searchParams.get('data.id') || paymentId
    if (!paymentId || signedId !== paymentId || !validSignature(request, signedId)) {
      return NextResponse.json({ error: 'Notificación inválida' }, { status: 401 })
    }
    const payment = await getPayment(paymentId)
    if (payment.status !== 'approved') return NextResponse.json({ ok: true })
    orderId = payment.external_reference || undefined
    if (!orderId) throw new Error('Pago sin orden')
    const { data: order, error } = await db.from('ordenes').select('*').eq('id', orderId).single()
    if (error || !order) throw new Error('Orden no encontrada')
    if (payment.currency_id !== 'ARS' || Math.round(Number(payment.transaction_amount) * 100) !== Math.round(Number(order.total) * 100)) {
      throw new Error('El importe del pago no coincide con la orden')
    }
    if (order.mp_payment_id && order.mp_payment_id !== paymentId) throw new Error('Orden asociada a otro pago')
    const { data: acquired, error: claimError } = await db.rpc('claim_paid_order', { p_order: orderId, p_lease: lease })
    if (claimError) throw claimError
    if (!acquired) {
      const { data: done } = await db.from('payment_fulfillments').select('email_sent_at').eq('order_id', orderId).single()
      // Si otro worker está en proceso, pedir reintento en lugar de perder la notificación.
      return NextResponse.json({ ok: !!done?.email_sent_at }, { status: done?.email_sent_at ? 200 : 503 })
    }
    claimed = true
    const { data: job, error: jobError } = await db.from('payment_fulfillments').select('*').eq('order_id', orderId).single()
    if (jobError) throw jobError
    // El destinatario es el correo del checkout, no el del titular de Mercado Pago.
    const email = String(order.datos_envio?.email || '').trim().toLowerCase()
    if (!email) throw new Error('La orden no tiene email de compra')
    let accessUrl = job.access_url as string | null
    let userId = job.account_id as string | null
    if (!accessUrl || !userId) {
      // Supabase crea el usuario si es nuevo o reutiliza el existente. No cambia su contraseña.
      const { data: link, error: linkError } = await db.auth.admin.generateLink({ type: 'magiclink', email })
      if (linkError || !link.user || !link.properties?.hashed_token) throw linkError || new Error('No se pudo crear acceso')
      userId = link.user.id
      const url = new URL('/acceso-compra', process.env.NEXT_PUBLIC_URL || 'https://theglowmarket.com.ar')
      url.hash = new URLSearchParams({ token_hash: link.properties.hashed_token, email }).toString()
      accessUrl = url.toString()
      const { error: saveError } = await db.from('payment_fulfillments')
        .update({ access_url: accessUrl, account_id: userId }).eq('order_id', orderId).eq('lease_id', lease)
      if (saveError) throw saveError
    }
    const { error: fulfillError } = await db.rpc('fulfill_paid_order', {
      p_order: orderId, p_lease: lease, p_user: userId, p_payment: paymentId,
    })
    if (fulfillError) throw fulfillError
    const { data: courses, error: coursesError } = await db.from('cursos').select('id').in('id', order.items.map((i: { id: string }) => i.id))
    if (coursesError) throw coursesError
    const courseIds = new Set(courses?.map(c => c.id))
    await sendOrderConfirmation({
      to: email, nombreCliente: order.datos_envio?.nombre || email.split('@')[0],
      ordenId: order.id, items: order.items, total: order.total,
      hasCurso: courseIds.size > 0,
      hasProductoFisico: order.items.some((i: { id: string }) => !courseIds.has(i.id)),
      accessUrl,
    })
    const { error: sentError } = await db.from('payment_fulfillments')
      .update({ email_sent_at: new Date().toISOString(), access_url: null, locked_until: null })
      .eq('order_id', orderId).eq('lease_id', lease)
    if (sentError) throw sentError
    return NextResponse.json({ ok: true })
  } catch {
    // No registrar enlaces de acceso ni datos personales en logs.
    console.error('No se pudo completar la confirmación de compra', { orderId })
    if (claimed && orderId) await db.from('payment_fulfillments').update({ locked_until: null }).eq('order_id', orderId).eq('lease_id', lease)
    return NextResponse.json({ error: 'Confirmación pendiente de reintento' }, { status: 500 })
  }
}
