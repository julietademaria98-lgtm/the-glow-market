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
}

export async function sendOrderConfirmation({
  to,
  nombreCliente,
  ordenId,
  items,
  total,
}: SendOrderConfirmationParams) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px;">
          ${item.nombre} x${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; text-align: right; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px;">
          $${(item.precio * item.quantity).toLocaleString('es-AR')}
        </td>
      </tr>`
    )
    .join('')

  await resend.emails.send({
    from: 'The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject: '¡Tu pedido está confirmado! ✨ The Glow Market',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f5f0eb; font-family: 'Georgia', serif;">
  <div style="max-width: 580px; margin: 0 auto; padding: 40px 20px;">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 40px;">
      <p style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 0.3em; color: #1a2340; text-transform: uppercase; margin: 0;">
        THE <span style="font-size: 22px; font-weight: 300;">GLOW</span> MARKET
      </p>
    </div>

    <!-- Card -->
    <div style="background: #ffffff; padding: 48px 40px; border-radius: 2px;">

      <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #1a2340; opacity: 0.5; margin: 0 0 16px 0;">
        Confirmación de pedido
      </p>

      <h1 style="font-size: 28px; font-weight: 300; color: #1a2340; margin: 0 0 8px 0; letter-spacing: 0.05em;">
        Hola, ${nombreCliente}
      </h1>

      <p style="font-size: 14px; color: #1a2340; opacity: 0.6; margin: 0 0 32px 0; line-height: 1.6;">
        Recibimos tu pedido y ya está siendo preparado con todo el cuidado que merece.
      </p>

      <!-- Divider -->
      <div style="border-top: 1px solid #e8e0d8; margin-bottom: 24px;"></div>

      <!-- Order number -->
      <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #1a2340; opacity: 0.4; margin: 0 0 24px 0;">
        Pedido #${ordenId.slice(0, 8).toUpperCase()}
      </p>

      <!-- Items -->
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

      <!-- Divider -->
      <div style="border-top: 1px solid #e8e0d8; margin: 32px 0;"></div>

      <p style="font-size: 13px; color: #1a2340; opacity: 0.6; line-height: 1.7; margin: 0;">
        Te avisaremos cuando tu pedido esté en camino. Si tenés alguna pregunta,
        respondé este mail o escribinos por Instagram.
      </p>

    </div>

    <!-- Footer -->
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
