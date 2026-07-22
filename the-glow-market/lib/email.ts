import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  nombre: string
  cantidad: number
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
  hasProductoFisico = true,
}: SendOrderConfirmationParams) {
  const subject = hasCurso && !hasProductoFisico
    ? '¡Tu curso está listo! ✨ The Glow Market'
    : '¡Tu pedido está confirmado! ✨ The Glow Market'

  const itemsHtml = items
    .map((item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px;">
          ${item.nombre} x${item.cantidad}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; text-align: right; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px;">
          $${(item.precio * item.cantidad).toLocaleString('es-AR')}
        </td>
      </tr>`)
    .join('')

  const cursoSection = hasCurso ? `
    <div style="background: #1a2340; padding: 24px 32px; margin-bottom: 32px; border-radius: 2px; text-align: center;">
      <p style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #e8b4b8; margin: 0 0 8px 0;">
        Tu curso está disponible ahora
      </p>
      <p style="font-family: 'Georgia', serif; font-size: 22px; font-weight: 300; color: #ffffff; margin: 0 0 12px 0;">
        Accedé cuando quieras, de por vida.
      </p>
      <p style="font-family: 'Georgia', serif; font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 24px 0;">
        Para ingresar al curso, entrá a la web con el <strong style="color: #e8b4b8;">usuario y contraseña</strong> que creaste al momento de la compra. Tu contenido ya está listo para disfrutar.
      </p>
      <a href="https://theglowmarket.com.ar/login"
        style="display: inline-block; background: #e8b4b8; color: #1a2340; font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 32px; text-decoration: none;">
        Ingresar al curso →
      </a>
    </div>
  ` : ''

  const productosSection = hasProductoFisico ? `
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHtml}
      <tr>
        <td style="padding: 16px 0 0 0; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px; font-weight: bold;">
          Total
        </td>
        <td style="padding: 16px 0 0 0; text-align: right; font-family: 'Georgia', serif; color: #1a2340; font-size: 16px; font-weight: bold;">
          $${total.toLocaleString('es-AR')}
        </td>
      </tr>
    </table>
    <div style="border-top: 1px solid #e8e0d8; margin: 32px 0;"></div>
    <p style="font-size: 13px; color: #1a2340; opacity: 0.6; line-height: 1.7; margin: 0;">
      Te avisaremos cuando tu pedido esté en camino. Si tenés alguna pregunta, respondé este mail o escribinos por Instagram.
    </p>
  ` : `
    <p style="font-size: 13px; color: #1a2340; opacity: 0.6; line-height: 1.7; margin: 0;">
      Si tenés alguna pregunta, respondé este mail o escribinos por Instagram.
    </p>
  `

  await resend.emails.send({
    from: 'The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f5f0eb; font-family: 'Georgia', serif;">
  <div style="max-width: 580px; margin: 0 auto; padding: 40px 20px;">

    <div style="text-align: center; margin-bottom: 40px;">
      <p style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 0.3em; color: #1a2340; text-transform: uppercase; margin: 0;">
        THE <span style="font-size: 22px; font-weight: 300;">GLOW</span> MARKET
      </p>
    </div>

    <div style="background: #ffffff; padding: 48px 40px; border-radius: 2px;">
      <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #1a2340; opacity: 0.5; margin: 0 0 16px 0;">
        Confirmación de compra
      </p>
      <h1 style="font-size: 28px; font-weight: 300; color: #1a2340; margin: 0 0 8px 0; letter-spacing: 0.05em;">
        Hola, ${nombreCliente}
      </h1>
      <p style="font-size: 14px; color: #1a2340; opacity: 0.6; margin: 0 0 32px 0; line-height: 1.6;">
        ${hasCurso && !hasProductoFisico
          ? 'Tu compra fue confirmada. Ya podés acceder a tu curso.'
          : 'Recibimos tu pedido y ya está siendo preparado con todo el cuidado que merece.'}
      </p>

      <div style="border-top: 1px solid #e8e0d8; margin-bottom: 24px;"></div>
      <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #1a2340; opacity: 0.4; margin: 0 0 24px 0;">
        Pedido #${ordenId.slice(0, 8).toUpperCase()}
      </p>

      ${cursoSection}
      ${productosSection}
    </div>

    <div style="text-align: center; margin-top: 32px;">
      <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #1a2340; opacity: 0.4; margin: 0;">
        The Glow Market · theglowmarket.com.ar
      </p>
    </div>

  </div>
</body>
</html>
    `,
  })
}
