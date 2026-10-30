import { Resend } from 'resend'

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://theglowmarket.com.ar'

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
  accessUrl?: string
  hasCurso?: boolean
  hasProductoFisico?: boolean
}

export async function sendOrderConfirmation({
  to,
  nombreCliente,
  ordenId,
  items,
  total,
  accessUrl,
  hasCurso = false,
  hasProductoFisico = true,
}: SendOrderConfirmationParams) {
  const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
  nombreCliente = escape(nombreCliente)
  const subject = hasCurso && !hasProductoFisico
    ? '¡Tu curso está listo! ✨ The Glow Market'
    : '¡Tu pedido está confirmado! ✨ The Glow Market'

  const itemsHtml = items
    .map((item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #ded8d2; font-family: Arial, sans-serif; color: #192149; font-size: 14px;">
          ${escape(item.nombre)} x${item.cantidad}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #ded8d2; text-align: right; font-family: Arial, sans-serif; color: #192149; font-size: 14px;">
          $${(item.precio * item.cantidad).toLocaleString('es-AR')}
        </td>
      </tr>`)
    .join('')

  const cursoSection = hasCurso ? `
    <div style="background: #192149; padding: 24px 32px; margin-bottom: 32px; border-radius: 24px; text-align: center;">
      <p style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #e1c8cb; margin: 0 0 8px 0;">
        Tu curso está disponible ahora
      </p>
      <p style="font-family: Arial, sans-serif; font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #ffffff; margin: 0 0 20px 0;">
        Accedé cuando quieras, de por vida.
      </p>

    </div>
  ` : ''

  const productosSection = hasProductoFisico ? `
    <table style="width: 100%; border-collapse: collapse;">
      ${itemsHtml}
      <tr>
        <td style="padding: 16px 0 0 0; font-family: Arial, sans-serif; color: #192149; font-size: 14px; font-weight: bold;">
          Total
        </td>
        <td style="padding: 16px 0 0 0; text-align: right; font-family: Arial, sans-serif; color: #192149; font-size: 16px; font-weight: bold;">
          $${total.toLocaleString('es-AR')}
        </td>
      </tr>
    </table>
    <div style="border-top: 1px solid #ded8d2; margin: 32px 0;"></div>
    <p style="font-size: 13px; color: #192149; opacity: 0.6; line-height: 1.7; margin: 0;">
      Te avisaremos cuando tu pedido esté en camino. Si tenés alguna pregunta, respondé este mail o escribinos por Instagram.
    </p>
  ` : `
    <p style="font-size: 13px; color: #192149; opacity: 0.6; line-height: 1.7; margin: 0;">
      Si tenés alguna pregunta, respondé este mail o escribinos por Instagram.
    </p>
  `

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject,
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin: 0; padding: 0; background-color: #e9e2da; font-family: Arial, sans-serif;">
  <div style="max-width: 580px; margin: 0 auto; padding: 40px 20px;">

    <div style="text-align: center; margin-bottom: 40px;">
      <p style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.3em; color: #192149; text-transform: uppercase; margin: 0;">
        THE <span style="font-family: Georgia, serif; font-size: 26px; font-weight: 400;">GLOW</span> MARKET
      </p>
    </div>

    <div style="background: #f4efe9; padding: 32px 24px; border-top: 12px solid #e1c8cb; border-radius: 40px 40px 24px 24px;">
      <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #192149; opacity: 0.5; margin: 0 0 16px 0;">
        Confirmación de compra
      </p>
      <h1 style="font-family: Georgia, serif; font-size: 36px; font-weight: 400; color: #192149; margin: 0 0 8px 0; letter-spacing: 0.05em;">
        Hola, ${nombreCliente}
      </h1>
      <p style="font-size: 14px; color: #192149; opacity: 0.6; margin: 0 0 32px 0; line-height: 1.6;">
        ${hasCurso && !hasProductoFisico
          ? 'Tu compra fue confirmada. Ya podés acceder a tu curso.'
          : 'Recibimos tu pedido y ya está siendo preparado con todo el cuidado que merece.'}
      </p>

      <div style="border-top: 1px solid #ded8d2; margin-bottom: 24px;"></div>
      <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #192149; opacity: 0.4; margin: 0 0 24px 0;">
        Pedido #${ordenId.slice(0, 8).toUpperCase()}
      </p>

      ${accessUrl ? `<p style="font-size:14px;line-height:1.7;color:#192149">Tu usuario es <strong>${escape(to)}</strong>. Tu cuenta ya está creada; si ya tenías una, conservás la misma.<br/><a href="${escape(accessUrl)}" style="display:inline-block;background:#192149;color:#f4efe9;padding:16px 24px;border-radius:999px;text-decoration:none;font-weight:600;margin:16px 0;">Hacé clic acá y creá tu contraseña</a><br/>Este enlace es personal y vence. Si necesitás otro, tocá «Recuperar contraseña» en Mi cuenta.</p>` : ''}
      ${cursoSection}
      ${productosSection}
    </div>

    <div style="text-align: center; margin-top: 32px;">
      <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #192149; opacity: 0.4; margin: 0;">
        The Glow Market · theglowmarket.com.ar
      </p>
    </div>

  </div>
</body>
</html>
    `,
  }, { idempotencyKey: `order-confirmation/${ordenId}` })
  if (error) throw new Error('No se pudo enviar la confirmación')
}

// ── Guía gratis "Los 7 infaltables de Nina" ──────────────────────────────────

export async function sendGuiaEmail({ to, nombre, token }: { to: string; nombre: string; token: string }) {
  const primerNombre = nombre.split(' ')[0]
  const link = `${BASE_URL}/infaltables?t=${token}`
  const unsubLink = `${BASE_URL}/api/guia/unsub?t=${token}`
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'Nina de The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject: 'Tus 7 infaltables ya están acá ✦',
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#d9d0c7;font-family:Arial,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:32px 20px">
  <div style="background:#e9e2da;border-radius:6px;overflow:hidden">
    <div style="background:#e9e2da;border-bottom:1px solid #cfc5bb;padding:24px;text-align:center">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.3em;color:#192149;text-transform:uppercase">
        THE <span style="font-family:Georgia,serif;font-size:24px;font-weight:400">GLOW</span> MARKET
      </p>
    </div>
    <div style="padding:40px 40px 32px;display:flex;flex-direction:column;gap:20px">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.2em;color:#192149">✦ TU GUÍA GRATIS</p>
      <h1 style="margin:0;font-family:Georgia,serif;font-weight:400;font-size:32px;line-height:1.2;color:#192149">Hola ${primerNombre}, <em>acá tenés tus 7 infaltables.</em></h1>
      <p style="margin:0;font-size:16px;line-height:1.65;color:#192149">Armé esta guía para que dejes de comprar productos que no usás. Son los 7 que tenés que tener sí o sí en tu neceser, para la mañana, la tarde y la noche.</p>
      <div style="background:#192149;border-radius:12px;padding:28px;margin:8px 0">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.2em;color:#e1c8cb">GUÍA GRATUITA · NINA AMATEIS</p>
        <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#e9e2da">Los 7 infaltables <em>de Nina</em></p>
        <a href="${link}" style="display:inline-block;background:#e1c8cb;color:#192149;text-decoration:none;font-size:16px;font-weight:700;padding:16px 36px;border-radius:999px">Ver mi guía</a>
      </div>
      <div style="border-top:1px solid #cfc5bb;padding-top:20px">
        <p style="margin:0;font-size:16px;line-height:1.65;color:#192149">¿Y después? Tener los productos es la mitad. En mi curso <strong>Day to Night Glow</strong> te enseño a usarlos para que el maquillaje te acompañe de la mañana a la noche.</p>
      </div>
      <a href="${BASE_URL}/cursos/day-to-night-glow" style="display:inline-block;border:1.5px solid #192149;color:#192149;text-decoration:none;font-size:15px;font-weight:500;padding:14px 32px;border-radius:999px;text-align:center">Conocer el curso</a>
      <p style="margin:8px 0 0;font-size:16px;font-family:Georgia,serif;font-style:italic;color:#192149">Un beso, Nina</p>
    </div>
    <div style="background:#e1c8cb;padding:14px;text-align:center;font-size:12px;line-height:1.6;color:#192149">
      The Glow Market · theglowmarket.com.ar · <a href="${unsubLink}" style="color:#192149">Darme de baja</a>
    </div>
  </div>
</div>
</body>
</html>`,
  })
  if (error) throw new Error('No se pudo enviar la guía')
}

// ── Cupón 15% OFF por reseña ──────────────────────────────────────────────────

export async function sendCuponEmail({ to, nombre, codigo }: { to: string; nombre: string; codigo: string }) {
  const primerNombre = nombre.split(' ')[0]
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'Nina de The Glow Market <hola@theglowmarket.com.ar>',
    to,
    subject: 'Tu 15% OFF está acá ✦',
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#d9d0c7;font-family:Arial,sans-serif">
<div style="max-width:580px;margin:0 auto;padding:32px 20px">
  <div style="background:#e9e2da;border-radius:6px;overflow:hidden">
    <div style="background:#e9e2da;border-bottom:1px solid #cfc5bb;padding:24px;text-align:center">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.3em;color:#192149;text-transform:uppercase">
        THE <span style="font-family:Georgia,serif;font-size:24px;font-weight:400">GLOW</span> MARKET
      </p>
    </div>
    <div style="padding:40px 40px 32px">
      <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.2em;color:#192149">✦ ¡GRACIAS POR TU RESEÑA, ${primerNombre.toUpperCase()}!</p>
      <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-weight:400;font-size:32px;line-height:1.2;color:#192149">Acá está tu <em>15% OFF.</em></h1>
      <div style="border:1.5px dashed #192149;border-radius:12px;padding:22px 24px;background:#e9e2da;margin-bottom:24px">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.18em;color:#192149">TU CÓDIGO</p>
        <p style="margin:0;font-family:Georgia,serif;font-size:36px;letter-spacing:0.08em;color:#192149">${codigo}</p>
      </div>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#192149">Usalo en tu próxima compra en theglowmarket.com.ar. Válido para neceseres, 30 días.</p>
      <a href="${BASE_URL}/productos" style="display:inline-block;background:#24508a;color:#fff;text-decoration:none;font-size:16px;font-weight:500;padding:16px 36px;border-radius:999px">Ir al Market</a>
    </div>
    <div style="background:#e1c8cb;padding:14px;text-align:center;font-size:12px;line-height:1.6;color:#192149">
      The Glow Market · theglowmarket.com.ar
    </div>
  </div>
</div>
</body>
</html>`,
  })
  if (error) throw new Error('No se pudo enviar el cupón')
}
