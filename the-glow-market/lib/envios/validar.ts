import { parsearCodigosPostales, slugProvincia, PROVINCIAS, type Zona } from './zonas'

export interface ZonaEntrada {
  nombre?: string
  descripcion?: string
  precio?: unknown
  activo?: boolean
  provincias?: string[]
  codigosPostales?: string
  envioGratis?: boolean
  envioGratisDesde?: unknown
}

export interface ZonaLimpia {
  nombre: string
  descripcion: string | null
  precio: number
  activo: boolean
  provincias: string[]
  codigos_postales: string[]
  envio_gratis: boolean
  envio_gratis_desde: number
}

const SLUGS_VALIDOS = new Set(PROVINCIAS.map(slugProvincia))

/** Normaliza lo que manda el panel, descartando provincias que no existen y CP mal escritos. */
export function limpiarZona(entrada: ZonaEntrada): ZonaLimpia {
  const nombre = String(entrada.nombre ?? '').trim()
  const precio = Number(entrada.precio)
  const provincias = (Array.isArray(entrada.provincias) ? entrada.provincias : [])
    .map((p) => slugProvincia(String(p)))
    .filter((p, i, todas) => SLUGS_VALIDOS.has(p) && todas.indexOf(p) === i)

  // Con la promo apagada el mínimo vuelve a 0, para no dejar guardado el importe de una promo
  // vieja que reaparecería sola al volver a prenderla.
  const envioGratis = Boolean(entrada.envioGratis)
  const desde = Number(entrada.envioGratisDesde)

  return {
    nombre,
    descripcion: String(entrada.descripcion ?? '').trim() || null,
    precio: Number.isFinite(precio) && precio > 0 ? precio : 0,
    activo: Boolean(entrada.activo) && nombre.length > 0,
    provincias,
    codigos_postales: parsearCodigosPostales(entrada.codigosPostales ?? ''),
    envio_gratis: envioGratis,
    envio_gratis_desde: envioGratis && Number.isFinite(desde) && desde > 0 ? desde : 0,
  }
}

/**
 * Revisa que la zona se pueda guardar. Devuelve el error para mostrar, o null si está bien.
 *
 * `otras` son las demás zonas ya guardadas: se usan para detectar códigos postales repartidos
 * en dos zonas, que harían que el precio dependa del orden de evaluación.
 */
export function validarZona(
  zona: ZonaLimpia,
  otras: Zona[],
  esDescarte: boolean,
): string | null {
  if (!zona.nombre) {
    return 'Ponele un nombre a la zona: es lo que ve el comprador en el checkout.'
  }

  // Los descartes cubren lo que sobra, así que no eligen región.
  if (esDescarte) return null

  if (zona.provincias.length === 0) {
    return 'Elegí al menos una provincia para la zona.'
  }

  const repetidos = new Set<string>()
  for (const otra of otras) {
    if (otra.codigosPostales.length === 0) continue
    // Solo chocan si además comparten provincia: el mismo número puede existir en dos
    // provincias distintas.
    const compartenProvincia =
      otra.provincias.length === 0 ||
      zona.provincias.length === 0 ||
      otra.provincias.some((p) => zona.provincias.includes(p))
    if (!compartenProvincia) continue

    for (const cp of zona.codigos_postales) {
      if (otra.codigosPostales.includes(cp)) repetidos.add(cp)
    }
  }

  if (repetidos.size > 0) {
    return `Estos códigos postales ya están en otra zona: ${Array.from(repetidos).join(', ')}. Dejalos en una sola.`
  }

  return null
}
