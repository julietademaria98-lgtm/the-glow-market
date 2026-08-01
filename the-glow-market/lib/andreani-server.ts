import { createClient as createServiceClient } from '@supabase/supabase-js'
import { cotizar, type AndreaniConfig } from './andreani'

/**
 * Cotiza el costo de envío desde el server (service-role). Nunca tira: si Andreani
 * falla o no hay config, devuelve el costo de respaldo configurado (fallback = true).
 */
export async function cotizarCostoEnvio(
  codigoPostal: string,
  subtotal: number,
): Promise<{ costo: number; fallback: boolean }> {
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data: cfg } = await db
    .from('andreani_config')
    .select('*')
    .eq('id', 'default')
    .maybeSingle()

  const fallback = Number(cfg?.costo_envio_fallback ?? 0)
  if (!cfg) return { costo: fallback, fallback: true }

  try {
    const kilos = Number(cfg.peso_default_kg) || 0.5
    const { tarifaConIva } = await cotizar(cfg as AndreaniConfig, {
      cpDestino: codigoPostal,
      kilos,
      valorDeclarado: subtotal,
    })
    if (!tarifaConIva || tarifaConIva <= 0) return { costo: fallback, fallback: true }
    return { costo: tarifaConIva, fallback: false }
  } catch (e) {
    console.error('cotizarCostoEnvio → usando fallback:', e)
    return { costo: fallback, fallback: true }
  }
}
