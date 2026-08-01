import { NextResponse } from 'next/server'
import { cotizarEnvio } from '@/lib/envios/server'

// Ruta pública: la usa el checkout mientras el comprador completa la dirección.
// Devuelve solo lo que se muestra en pantalla; el precio que se cobra se vuelve a calcular
// en create-preference, así que un cliente no puede alterarlo desde acá.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const provincia = String(body.provincia || '').trim()
  const codigoPostal = String(body.codigoPostal || '').trim()

  if (!provincia) {
    return NextResponse.json({ ok: false, error: 'Falta la provincia' }, { status: 400 })
  }

  const envio = await cotizarEnvio(provincia, codigoPostal)
  return NextResponse.json({ ok: true, ...envio })
}
