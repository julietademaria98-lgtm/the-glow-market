import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPayment } from '@/lib/mercadopago'
import type { MPWebhookData } from '@/types'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The Glow Market <admin@theglowmarket.com.ar>',
      to,
      subject,
      html,
    }),
  })
}

function emailConfirmacionPedido(orden: any): string {
  const items = orden.items?.map((item: any) => `
    <tr>
      <td style="padding:8px 0;font-family:Georgia,serif;font-size:14px;color:#192149;border-bottom:1px solid rgba(25,33,73,0.06);">
        ${item.nombre}${item.cantidad > 1 ? ` <span style="color:#192149;opacity:0.4;">×${item.cantidad}</span>` : ''}
      </td>
      <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#192149;text-align:right;border-bottom:1px solid rgba(25,33,73,0.06);">
        $${(item.precio * item.cantidad).toLocaleString('es-AR')}
      </td>
    </tr>
  `).join('') || ''

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background-color:#f5f0eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0eb;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:560px;width:100%;">
        <tr>
          <td style="background-color:#192149;padding:40px;text-align:center;">
            <p style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.4);">+ The Glow Market +</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-weight:300;color:#ffffff;letter-spacing:0.2em;font-size:28px;text-transform:uppercase;">
              THE <span style="font-size:38px;font-weight:400;">GLOW</span> MARKET
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:48px 40px 40px;text-align:center;">
            <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#192149;opacity:0.4;">Confirmación de compra</p>
            <h2 style="margin:0 0 24px 0;font-family:Georgia,serif;font-weight:300;font-size:28px;color:#192149;">
              ¡Tu pedido está confirmado!
            </h2>
            <p style="margin:0 0 32px 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.8;color:#192149;opacity:0.65;">
              Gracias por tu compra. Estamos preparando tu pedido.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${items}
              <tr>
                <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#192149;opacity:0.5;">Total</td>
                <td style="padding:12px 0 0;font-family:Arial,sans-serif;font-size:15px;font-weight:600;color:#192149;text-align:right;">$${orden.total?.toLocaleString('es-AR')}</td>
              </tr>
            </table>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#192149;opacity:0.35;line-height:1.6;">
              Pedido #${orden.id?.slice(0, 8).toUpperCase()}
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(25,33,73,0.08);padding:24px 40px;text-align:center;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#192149;opacity:0.3;">
              The Glow Market · Own Your Glow
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function emailAccesoCurso(tituloCurso: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background-color:#f5f0eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0eb;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:560px;width:100%;">
        <tr>
          <td style="background-color:#192149;padding:40px;text-align:center;">
            <p style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.4);">+ Formación Exclusiva +</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-weight:300;color:#ffffff;letter-spacing:0.2em;font-size:28px;text-transform:uppercase;">
              THE <span style="font-size:38px;font-weight:400;">GLOW</span> MARKET
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:48px 40px 40px;text-align:center;">
            <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#192149;opacity:0.4;">Acceso al curso</p>
            <h2 style="margin:0 0 24px 0;font-family:Georgia,serif;font-weight:300;font-size:28px;color:#192149;">
              ¡Ya podés acceder a tu curso!
            </h2>
            <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:18px;color:#192149;font-style:italic;">
              ${tituloCurso}
            </p>
            <p style="margin:0 0 32px 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.8;color:#192149;opacity:0.65;">
              Tu acceso está activo. Ingresá a tu cuenta para empezar.
            </p>
            <a href="https://theglowmarket.com.ar/mi-curso"
              style="display:inline-block;background-color:#192149;color:#ffffff;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
              Acceder al curso
            </a>
            <p style="margin:32px 0 0 0;font-family:Arial,sans-serif;font-size:11px;color:#192149;opacity:0.35;line-height:1.6;">
              Si tenés algún problema escribinos a admin@theglowmarket.com.ar
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(25,33,73,0.08);padding:24px 40px;text-align:center;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#192149;opacity:0.3;">
              The Glow Market · Own Your Glow
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

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
      .update({ estado: 'aprobado', mp_payment_id: String(paymentId) })
      .eq('id', orderId)
      .select()
      .single()

    if (ordenError || !orden) {
      return NextResponse.json({ error: 'Error actualizando orden' }, { status: 500 })
    }

    const emailDestino = orden.datos_envio?.email || null
    let tieneCurso = false
    let tituloCurso = ''

    if (orden.user_id && orden.items) {
      for (const item of orden.items) {
        const { data: curso } = await adminClient
          .from('cursos')
          .select('id, titulo')
          .eq('id', item.id)
          .single()

        if (curso) {
          tieneCurso = true
          tituloCurso = curso.titulo
          await adminClient
            .from('accesos_curso')
            .upsert({ user_id: orden.user_id, curso_id: curso.id, activo: true })
        }
      }
    }

    // Enviar emails
    if (emailDestino) {
      if (tieneCurso) {
        await sendEmail(
          emailDestino,
          '¡Ya tenés acceso a tu curso! — The Glow Market',
          emailAccesoCurso(tituloCurso)
        )
      } else {
        await sendEmail(
          emailDestino,
          'Tu pedido fue confirmado — The Glow Market',
          emailConfirmacionPedido(orden)
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
