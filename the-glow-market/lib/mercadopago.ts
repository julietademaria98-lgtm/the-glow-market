import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import type { CartItem } from '@/types'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function createPreference(items: CartItem[], orderId: string) {
  const preference = new Preference(client)

  const response = await preference.create({
    body: {
      items: items.map((item) => ({
        id: item.id,
        title: item.nombre,
        quantity: item.quantity,
        unit_price: Number(item.precio),
        currency_id: 'ARS',
        picture_url: item.imagen_url,
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/success?order=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_URL}/failure?order=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_URL}/success?order=${orderId}&pending=true`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
      external_reference: orderId,
      statement_descriptor: 'THE GLOW MARKET',
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
    },
  })

  return response
}

export async function getPayment(paymentId: string) {
  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}
