import { createClient as createServiceClient } from '@supabase/supabase-js'
import { resolverZona, estaConfigurada, type Zona, type TipoZona } from './zonas'

export interface EnvioCotizado {
  /** false si no hay envío a esa dirección: sin provincia, o zona sin configurar. */
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

interface FilaZona {
  id: string
  nombre: string | null
  descripcion: string | null
  precio: string | number | null
  activo: boolean | null
  tipo: string | null
  provincias: string[] | null
  codigos_postales: string[] | null
  envio_gratis: boolean | null
  envio_gratis_desde: string | number | null
}

/** Pasa una fila de `envio_zonas` al tipo que entiende el matcheo. */
export function filaAZona(fila: FilaZona): Zona {
  return {
    id: fila.id,
    nombre: fila.nombre ?? '',
    descripcion: fila.descripcion,
    precio: Number(fila.precio) || 0,
    activo: Boolean(fila.activo),
    tipo: (fila.tipo ?? 'normal') as TipoZona,
    provincias: fila.provincias ?? [],
    codigosPostales: fila.codigos_postales ?? [],
    envioGratis: Boolean(fila.envio_gratis),
    envioGratisDesde: Number(fila.envio_gratis_desde) || 0,
  }
}

export function servicio() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      // Next 14 cachea los fetch por defecto, y supabase-js consulta con fetch. Sin esto, el
      // checkout sigue cotizando con los precios y las zonas que había la primera vez, y los
      // cambios del panel no aparecen hasta redeployar.
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, cache: 'no-store' }),
      },
    },
  )
}

const COLUMNAS =
  'id, nombre, descripcion, precio, activo, tipo, provincias, codigos_postales, envio_gratis, envio_gratis_desde'

/**
 * Todas las zonas en el orden en que se evalúan: el que definió el admin arrastrándolas, con
 * "Resto del país" al final. `created_at` solo desempata zonas que quedaron con el mismo
 * número de orden.
 */
export async function leerZonas(): Promise<Zona[]> {
  const { data, error } = await servicio()
    .from('envio_zonas')
    .select(COLUMNAS)
    .order('orden', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('leerZonas → error:', error.message)
    return []
  }

  // "Resto del país" va al final aunque su `orden` diga otra cosa: cubre todo lo que sobra, así
  // que en cualquier otra posición dejaría sin efecto a las zonas de abajo.
  const zonas = (data || []).map(filaAZona)
  return zonas.sort((a, b) => Number(a.tipo === 'resto-pais') - Number(b.tipo === 'resto-pais'))
}

/**
 * Cotiza el envío para una dirección. Es la única fuente de verdad del precio: la usan tanto
 * el checkout (para mostrar) como create-preference (para cobrar), así que lo que se muestra y
 * lo que se cobra no pueden separarse.
 *
 * `subtotal` es lo que suman los productos del carrito, y solo se usa para la promo de envío
 * gratis. Va en 0 por defecto porque una zona sin promo no lo mira.
 *
 * Nunca inventa un precio: si la zona no está configurada devuelve `disponible: false` en
 * lugar de caer en un valor por defecto.
 */
export async function cotizarEnvio(
  provincia: string,
  codigoPostal: string,
  subtotal = 0,
): Promise<EnvioCotizado> {
  const zonas = await leerZonas()
  const zona = resolverZona(provincia, codigoPostal, zonas)

  if (!zona || !estaConfigurada(zona)) {
    return { ...NO_DISPONIBLE, zonaId: zona?.id ?? null }
  }

  const gratis = zona.envioGratis && subtotal >= zona.envioGratisDesde

  return {
    disponible: true,
    zonaId: zona.id,
    nombre: zona.nombre,
    descripcion: zona.descripcion,
    precio: gratis ? 0 : zona.precio,
  }
}
