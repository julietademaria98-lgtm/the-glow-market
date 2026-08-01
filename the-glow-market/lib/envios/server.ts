import { createClient as createServiceClient } from '@supabase/supabase-js'
import { resolverZona } from './zonas'

export interface EnvioCotizado {
  /** false si no hay envío a esa dirección: zona desconocida, sin configurar o apagada. */
  disponible: boolean
  zonaId: string | null
  nombre: string
  descripcion: string | null
  precio: number
}

const NO_DISPONIBLE: EnvioCotizado = {
  disponible: false,
  zonaId: null,
  nombre: '',
  descripcion: null,
  precio: 0,
}

/**
 * Cotiza el envío para una dirección. Es la única fuente de verdad del precio: la usan
 * tanto el checkout (para mostrar) como create-preference (para cobrar), así que lo que se
 * muestra y lo que se cobra no pueden separarse.
 *
 * Nunca inventa un precio: si la zona no está configurada devuelve `disponible: false` en
 * lugar de caer en un valor por defecto.
 */
export async function cotizarEnvio(
  provincia: string,
  codigoPostal: string,
): Promise<EnvioCotizado> {
  const zonaId = resolverZona(provincia, codigoPostal)
  if (!zonaId) return NO_DISPONIBLE

  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data, error } = await db
    .from('envio_zonas')
    .select('nombre, descripcion, precio, activo')
    .eq('id', zonaId)
    .maybeSingle()

  if (error) {
    console.error('cotizarEnvio → error leyendo la zona:', error.message)
    return { ...NO_DISPONIBLE, zonaId }
  }

  // Sin nombre no hay nada que mostrarle al comprador, así que cuenta como no configurada.
  // Un precio en 0 con la zona activa sí es válido: es envío gratis a propósito.
  if (!data || !data.activo || !String(data.nombre || '').trim()) {
    return { ...NO_DISPONIBLE, zonaId }
  }

  return {
    disponible: true,
    zonaId,
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: Number(data.precio) || 0,
  }
}
