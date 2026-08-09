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
  requiereCuenta?: boolean
}

export async function sendOrderConfirmation({
  to,
  nombreCliente,
  ordenId,
  items,
  total,
  hasCurso = false,
  hasProductoFisico = true,
  requiereCuenta = false,
}: SendOrderConfirmationParams) {
  const subject = hasCurso && !hasProductoFisico
    ? requiereCuenta
      ? 'Un paso más para acceder a tu curso ✦ The Glow Market'
      : '¡Tu curso está listo! ✦ The Glow Market'
    : 'Tu pedido está en camino ✦ The Glow Market'

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

  const cursoSection = hasCurso
    ? requiereCuenta
      ? `
    <div style="background: #192149; padding: 24px 32px; margin-bottom: 32px; border-radius: 2px; text-align: center;">
      <p style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #e8b4b8; margin: 0 0 8px 0;">
        Un paso más para entrar
      </p>
      <p style="font-family: 'Georgia', serif; font-size: 20px; font-weight: 300; color: #ffffff; margin: 0 0 12px 0;">
        Creá tu cuenta gratis con este mismo email
      </p>
      <p style="font-family: 'Georgia', serif; font-size: 13px; color: rgba(255,255,255,0.7); margin: 0 0 20px 0; line-height: 1.6;">
        Usá <strong>${to}</strong> al crear tu cuenta y, apenas inicies sesión, tu curso se activa solo.
      </p>
      <a href="https://theglowmarket.com.ar/registro"
        style="display: inline-block; background: #e9e2da; color: #192149; font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 32px; text-decoration: none;">
        Crear mi cuenta →
      </a>
    </div>
  `
      : `
    <div style="background: #192149; padding: 24px 32px; margin-bottom: 32px; border-radius: 2px; text-align: center;">
      <p style="font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #e8b4b8; margin: 0 0 8px 0;">
        Tu curso está disponible ahora
      </p>
      <p
