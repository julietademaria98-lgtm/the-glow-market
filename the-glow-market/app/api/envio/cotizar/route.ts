import { NextResponse } from 'next/server'
import { cotizarCostoEnvio } from '@/lib/andreani-server'

// Ruta pública (la usa el checkout). Solo devuelve un número; nunca credenciales.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const codigoPostal = String(body.codigoPostal || '').trim()
  const subtotal = Number(body.subtotal) || 0

  if (codigoPostal.length < 4) {
    return NextResponse.json({ ok: false, error: 'Código postal inválido' }, { status: 400 })
  }

  const { costo, fallback } = await cotizarCostoEnvio(codigoPostal, subtotal)
  return NextResponse.json({ ok: true, costo, fallback })
}
