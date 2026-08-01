import { createClient as createServiceClient } from '@supabase/supabase-js'
import {
  resolverZona,
  ZONAS,
  ZONAS_POR_CP,
  ZONA_BUENOS_AIRES_RESTO,
  ZONA_INTERIOR,
  type CodigosPorZona,
} from './zonas'

const PROVINCIAS = new Set(ZONAS.filter((z) => z.grupo === 'provincia').map((z) => z.id))
const esProvincia = (id: string) => PROVINCIAS.has(id)

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

  let zonaId = resolverZona(provincia, codigoPostal, codigosPorZona)
  if (!zonaId) return NO_DISPONIBLE

  const buscar = (id: string) => filas.find((f) => f.id === id)
  const interior = buscar(ZONA_INTERIOR)
  let zona = buscar(zonaId)

  // Una zona apagada no deja a nadie sin envío: cae en la zona que la contiene. Apagarla es
  // dejar de darle trato especial, no dejar de vender ahí.
  if (esProvincia(zonaId)) {
    // Las provincias son excepciones al precio del interior: solo valen si están prendidas.
    if (!zona?.activo) {
      zonaId = ZONA_INTERIOR
      zona = interior
    } else if (!String(zona.nombre || '').trim()) {
      // Excepción sin texto propio: se cobra su precio pero se muestra el texto del interior,
      // así agregar una provincia es poner un precio y nada más.
      zona = {
        ...zona,
        nombre: interior?.nombre ?? '',
        descripcion: interior?.descripcion ?? null,
      }
    }
  } else if (ZONAS_POR_CP.includes(zonaId as (typeof ZONAS_POR_CP)[number])) {
    // GBA y GBA2 caen en el resto de la provincia.
    if (!estaConfigurada(zona)) {
      zonaId = ZONA_BUENOS_AIRES_RESTO
      zona = buscar(zonaId)
    }
  }

  if (!estaConfigurada(zona)) {
    return { ...NO_DISPONIBLE, zonaId }
  }

  return {
    disponible: true,
    zonaId,
    nombre: zona!.nombre,
    descripcion: zona!.descripcion,
    precio: Number(zona!.precio) || 0,
  }
}

/**
 * Una zona sirve si está prendida y tiene nombre: sin nombre no hay nada que mostrarle al
 * comprador. Un precio en 0 con la zona activa sí es válido, es envío gratis a propósito.
 */
function estaConfigurada(zona?: { nombre?: string | null; activo?: boolean | null }): boolean {
  return Boolean(zona && zona.activo && String(zona.nombre || '').trim())
}
