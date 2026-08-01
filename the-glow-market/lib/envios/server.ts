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

const COLUMNAS = 'id, nombre, descripcion, precio, activo, tipo, provincias, codigos_postales'

/**
 * Todas las zonas en el orden en que se evalúan: el que definió el admin arrastrándolas, con
 * los dos descartes al final. `created_at` solo desempata zonas que quedaron con el mismo
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

  const zonas = (data || []).map(filaAZona)
  const nivel = (z: Zona) => (z.tipo === 'resto-pais' ? 2 : z.tipo === 'resto-bsas' ? 1 : 0)
  return zonas.sort((a, b) => nivel(a) - nivel(b))
}

/**
 * Cotiza el envío para una dirección. Es la única fuente de verdad del precio: la usan tanto
 * el checkout (para mostrar) como create-preference (para cobrar), así que lo que se muestra y
 * lo que se cobra no pueden separarse.
 *
 * Nunca inventa un precio: si la zona no está configurada devuelve `disponible: false` en
 * lugar de caer en un valor por defecto.
 */
export async function cotizarEnvio(
  provincia: string,
  codigoPostal: string,
): Promise<EnvioCotizado> {
  const zonas = await leerZonas()
  const zona = resolverZona(provincia, codigoPostal, zonas)

  if (!zona || !estaConfigurada(zona)) {
    return { ...NO_DISPONIBLE, zonaId: zona?.id ?? null }
  }

  return {
    disponible: true,
    zonaId: zona.id,
    nombre: zona.nombre,
    descripcion: zona.descripcion,
    precio: zona.precio,
  }
}
