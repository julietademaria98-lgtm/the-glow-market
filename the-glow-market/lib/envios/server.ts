import { createClient as createServiceClient } from '@supabase/supabase-js'
import { resolverZona, type CodigosPorZona } from './zonas'

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
  const db = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Se traen todas las zonas de una: los códigos postales de GBA/GBA2 se editan desde el
  // panel, así que hay que leerlos para saber a qué zona cae la dirección.
  const { data, error } = await db
    .from('envio_zonas')
    .select('id, nombre, descripcion, precio, activo, codigos_postales')

  if (error) {
    console.error('cotizarEnvio → error leyendo las zonas:', error.message)
    return NO_DISPONIBLE
  }

  const filas = data || []
  const codigosPorZona: CodigosPorZona = {}
  for (const fila of filas) codigosPorZona[fila.id] = fila.codigos_postales

  const zonaId = resolverZona(provincia, codigoPostal, codigosPorZona)
  if (!zonaId) return NO_DISPONIBLE

  const zona = filas.find((f) => f.id === zonaId)

  // Sin nombre no hay nada que mostrarle al comprador, así que cuenta como no configurada.
  // Un precio en 0 con la zona activa sí es válido: es envío gratis a propósito.
  if (!zona || !zona.activo || !String(zona.nombre || '').trim()) {
    return { ...NO_DISPONIBLE, zonaId }
  }

  return {
    disponible: true,
    zonaId,
    nombre: zona.nombre,
    descripcion: zona.descripcion,
    precio: Number(zona.precio) || 0,
  }
}
