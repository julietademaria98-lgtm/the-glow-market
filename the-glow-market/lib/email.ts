import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  nombre: string
  quantity: number
  precio: number
}

interface SendOrderConfirmationParams {
  to: string
  nombreCliente: string
  ordenId: string
  items: OrderItem[]
  total: number
  hasCurso?: boolean
  hasProductoFisico?: boolean
}

export async function sendOrderConfirmation({
  to,
  nombreCliente,
  ordenId,
  items,
  total,
  hasCurso = false,
  hasProductoFisico = false,
}: SendOrderConfirmationParams) {
  const subject = hasCurso && !hasProductoFisico
    ? '¡Tu curso está listo! · The Glow Market'
    : '¡Tu pedido está confirmado! · The Glow Market'

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; font-family: Georgia, serif; color: #192149; font-size: 14px;">
          ${item.nombre} × ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; text-align: right; font-family: Georgia, serif; color: #192149; font-size: 14px;">
          $${(item.precio * item.quantity).toLocaleString('es-AR')}
        </td>
      </tr>`
    )
    .join('')

  const cursoSection = hasCurso ? `
    <div style="background: #192149; padding: 32px 36px; margin-bottom: 24px; border-radius: 2px;">
      <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #E1C8CB; margin: 0 0 12px 0;">
        Acceso al curso
      </p>
      <h2 style="font-size: 22px; font-weight: 300; color: #ffffff; margin: 0 0 12px 0; letter-spacing: 0.03em;">
        Day to Night Glow
      </h2>
      <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.7; margin: 0 0 24px 0;">
        Tu acceso está confirmado. Para ver el curso, ingresá con el mismo email y contraseña que usaste al registrarte.
      </p>
      <a href="https://theglowmarket.com.ar/login?redirect=%2Fmi-curso"
         style="display: inline-block; background: #E1C8CB; color: #192149; padding: 12px 28px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-family: Arial, sans-serif;">
        Ir a mi curso
      </a>
    </div>
  ` : ''

  const productoSection = hasProductoFisico ? `
    <p style="font-size: 13px; color: #192149; opacity: 0.6; line-height: 1.7; margin: 0 0 8px 0;">
      Tu pedido está siendo preparado. Te avisamos cuando esté en camino.
    </p>
  ` : ''

  const mensajeFinal = hasCurso && !hasProductoFisico
    ? 'Si tenés alguna pregunta sobre el curso, respondé este mail o escribinos por Instagram.'
    : 'Si tenés alguna pregunta sobre tu pedido, respondé este mail o escribinos por Instagram.'

  await resend.emails.send({
    from: 'The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #E9E2DA; font-family: Georgia, serif;">
  <div style="max-width: 580px; margin: 0 auto; padding: 40px 20px;">

    <div style="text-align: center; margin-bottom: 36px;">
      <p style="font-family: Georgia, serif; font-size: 11px; letter-spacing: 0.3em; color: #192149; text-transform: uppercase; margin: 0;">
        THE <span style="font-size: 20px; font-weight: 300;">GLOW</span> MARKET
      </p>
    </div>

    <div style="background: #ffffff; padding: 40px 36px; border-radius: 2px;">

      <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #192149; opacity: 0.5; margin: 0 0 12px 0;">
        Confirmación · #${ordenId.slice(0, 8).toUpperCase()}
      </p>

      <h1 style="font-size: 26px; font-weight: 300; color: #192149; margin: 0 0 8px 0; letter-spacing: 0.04em;">
        Hola, ${nombreCliente}
      </h1>

      <p style="font-size: 13px; color: #192149; opacity: 0.6; margin: 0 0 28px 0; line-height: 1.7;">
        ${hasCurso ? 'Gracias por tu compra. Todo está listo para que empieces.' : 'Recibimos tu pedido y ya está siendo preparado.'}
      </p>

      <div style="border-top: 1px solid #e8e0d8; margin-bottom: 24px;"></div>

      ${cursoSection}

      ${hasProductoFisico ? `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        ${itemsHtml}
        <tr>
          <td style="padding: 14px 0 0 0; font-family: Georgia, serif; color: #192149; font-size: 14px; font-weight: bold;">Total</td>
          <td style="padding: 14px 0 0 0; text-align: right; font-family: Georgia, serif; color: #192149; font-size: 16px; font-weight: bold;">$${total.toLocaleString('es-AR')}</td>
        </tr>
      </table>
      ${productoSection}
      ` : ''}

      <div style="border-top: 1px solid #e8e0d8; margin: 28px 0 20px 0;"></div>

      <p style="font-size: 12px; color: #192149; opacity: 0.5; line-height: 1.7; margin: 0;">
        ${mensajeFinal}
      </p>

    </div>

    <div style="text-align: center; margin-top: 28px;">
      <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #192149; opacity: 0.4; margin: 0;">
        The Glow Market · theglowmarket.com.ar
      </p>
    </div>

  </div>
</body>
</html>
    `,
  })
}
