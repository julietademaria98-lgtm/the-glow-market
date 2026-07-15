import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  nombre: string
  cantidad?: number
  quantity?: number
  precio: number
}

interface SendOrderConfirmationParams {
  to: string
  nombreCliente: string
  ordenId: string
  items: OrderItem[]
  total: number
  hasCurso: boolean
  hasProductoFisico: boolean
}

export async function sendOrderConfirmation({
  to,
  nombreCliente,
  ordenId,
  items,
  total,
  hasCurso,
  hasProductoFisico,
}: SendOrderConfirmationParams) {
  const itemsFisicos = items.filter((i) => {
    const nombre = i.nombre.toLowerCase()
    return !nombre.includes('day to night') && !nombre.includes('curso')
  })

  const itemsFisicosHtml = itemsFisicos
    .map((item) => {
      const qty = item.cantidad ?? item.quantity ?? 1
      return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px;">
          ${item.nombre} x${qty}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d8; text-align: right; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px;">
          $${(item.precio * qty).toLocaleString('es-AR')}
        </td>
      </tr>`
    })
    .join('')

  const cursosSection = hasCurso ? `
    <div style="background: #192149; padding: 32px; margin-bottom: 24px; border-radius: 2px;">
      <p style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0 0 12px 0; font-family: 'Helvetica Neue', sans-serif;">
        Curso Online
      </p>
      <h2 style="font-size: 26px; font-weight: 300; color: #ffffff; margin: 0 0 8px 0; letter-spacing: 0.05em; font-family: 'Georgia', serif;">
        Day to Night Glow
      </h2>
      <p style="font-size: 13px; color: rgba(255,255,255,0.65); margin: 0 0 24px 0; line-height: 1.6; font-family: 'Helvetica Neue', sans-serif;">
        Tu acceso al curso está confirmado. Para verlo, ingresá con el usuario y contraseña que creaste al momento de la compra.
      </p>
      <a href="https://theglowmarket.com.ar/login"
         style="display: inline-block; background: #ffffff; color: #192149; padding: 14px 28px; font-family: 'Helvetica Neue', sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;">
        Acceder al curso
      </a>
      <p style="font-size: 11px; color: rgba(255,255,255,0.4); margin: 16px 0 0 0; font-family: 'Helvetica Neue', sans-serif;">
        ¿Todavía no tenés cuenta? Creá una en theglowmarket.com.ar/registro con este mismo email.
      </p>
    </div>
  ` : ''

  const productosFisicosSection = hasProductoFisico ? `
    <div style="margin-bottom: 24px;">
      <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #1a2340; opacity: 0.4; margin: 0 0 16px 0; font-family: 'Helvetica Neue', sans-serif;">
        Pedido #${ordenId.slice(0, 8).toUpperCase()}
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsFisicosHtml}
        <tr>
          <td style="padding: 16px 0 0 0; font-family: 'Georgia', serif; color: #1a2340; font-size: 14px; font-weight: bold;">
            Total
          </td>
          <td style="padding: 16px 0 0 0; text-align: right; font-family: 'Georgia', serif; color: #1a2340; font-size: 16px; font-weight: bold;">
            $${total.toLocaleString('es-AR')}
          </td>
        </tr>
      </table>
      <div style="border-top: 1px solid #e8e0d8; margin: 24px 0;"></div>
      <p style="font-size: 13px; color: #1a2340; opacity: 0.6; line-height: 1.7; margin: 0; font-family: 'Helvetica Neue', sans-serif;">
        Tu pedido está siendo preparado. Te avisamos cuando esté en camino.
        Si tenés alguna pregunta, respondé este mail o escribinos por Instagram.
      </p>
    </div>
  ` : ''

  await resend.emails.send({
    from: 'The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject: hasCurso
      ? '¡Tu acceso a Day to Night Glow está listo! ✨'
      : '¡Tu pedido está confirmado! ✨ The Glow Market',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f5f0eb; font-family: 'Georgia', serif;">
  <div style="max-width: 580px; margin: 0 auto; padding: 40px 20px;">

    <div style="text-align: center; margin-bottom: 40px;">
      <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 0.3em; color: #1a2340; text-transform: uppercase; margin: 0;">
        THE <span style="font-size: 22px; font-weight: 300;">GLOW</span> MARKET
      </p>
    </div>

    <div style="background: #ffffff; padding: 48px 40px; border-radius: 2px;">

      <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #1a2340; opacity: 0.5; margin: 0 0 16px 0; font-family: 'Helvetica Neue', sans-serif;">
        Confirmación de compra
      </p>

      <h1 style="font-size: 28px; font-weight: 300; color: #1a2340; margin: 0 0 24px 0; letter-spacing: 0.05em;">
        Hola, ${nombreCliente}
      </h1>

      <div style="border-top: 1px solid #e8e0d8; margin-bottom: 32px;"></div>

      ${cursosSection}
      ${productosFisicosSection}

    </div>

    <div style="text-align: center; margin-top: 32px;">
      <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #1a2340; opacity: 0.4; margin: 0; font-family: 'Helvetica Neue', sans-serif;">
        The Glow Market · theglowmarket.com.ar
      </p>
    </div>

  </div>
</body>
</html>
    `,
  })
}
