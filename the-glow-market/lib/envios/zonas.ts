/**
 * Zonas de envío: dado provincia + código postal, decide a qué zona pertenece una dirección.
 *
 * Acá no hay ni precios, ni textos, ni códigos postales. Todo eso lo carga el admin y vive en
 * la tabla `envio_zonas`; este archivo solo tiene la mecánica del matcheo, que es la misma
 * pase lo que pase con esos datos.
 *
 * Buenos Aires se parte en tres zonas según el CP; el resto del país matchea por provincia.
 */

export type GrupoZona = 'buenos-aires' | 'provincia'

export interface Zona {
  id: string
  grupo: GrupoZona
  /**
   * Etiqueta interna, solo para que el admin identifique la fila en el panel. Lo que ve el
   * comprador es siempre el `nombre` que se carga en la base.
   */
  etiqueta: string
  /** Si su lista de códigos postales se edita desde el panel. */
  editaCodigosPostales?: boolean
}

/** Provincias que matchean por nombre (todas menos Buenos Aires, que va por CP). */
const PROVINCIAS_POR_NOMBRE = [
  'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos',
  'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
]

// Diacríticos combinantes que deja NFD. Se arma desde string para que el escape quede en
// ASCII y no dependa de cómo se guarde el archivo.
const DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g')

/** Quita acentos y normaliza: 'Entre Ríos' → 'entre-rios'. El campo del form es texto libre. */
export function slugProvincia(valor: string): string {
  return (valor || '')
    .normalize('NFD')
    .replace(DIACRITICOS, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

/**
 * Devuelve el CP solo si son exactamente 4 dígitos. Los códigos postales de la tienda son
 * numéricos: no se acepta el formato CPA con letras ('B1602ABC'), así que lo que entra por
 * la API tiene que cumplir lo mismo que pide el formulario.
 */
export function normalizarCP(valor: string): string | null {
  const limpio = String(valor || '').trim()
  return /^\d{4}$/.test(limpio) ? limpio : null
}

export const ZONA_BUENOS_AIRES = 'buenos-aires'

/**
 * Zonas bonaerenses que matchean por lista de CP, en orden de prioridad: si un código llegara
 * a estar cargado en las dos, gana la primera. El panel avisa cuando eso pasa, pero el orden
 * acá garantiza que el resultado sea siempre el mismo.
 */
export const ZONAS_POR_CP = ['gba', 'gba2'] as const

/** Zona bonaerense por descarte: todo CP que no esté en ninguna lista. */
export const ZONA_BUENOS_AIRES_RESTO = 'bsas-resto'

/** Las 26 zonas: 3 de Buenos Aires + 23 provincias. */
export const ZONAS: Zona[] = [
  { id: 'gba', grupo: 'buenos-aires', etiqueta: 'GBA', editaCodigosPostales: true },
  { id: 'gba2', grupo: 'buenos-aires', etiqueta: 'GBA2', editaCodigosPostales: true },
  { id: ZONA_BUENOS_AIRES_RESTO, grupo: 'buenos-aires', etiqueta: 'Resto de Buenos Aires' },
  ...PROVINCIAS_POR_NOMBRE.map((p): Zona => ({
    id: slugProvincia(p),
    grupo: 'provincia',
    etiqueta: p,
  })),
]

const ZONA_IDS = new Set(ZONAS.map((z) => z.id))

/** Códigos postales de cada zona, tal como están cargados en la base. */
export type CodigosPorZona = Record<string, string[] | null | undefined>

/**
 * Devuelve el id de zona para una dirección, o null si no se puede determinar (provincia
 * desconocida, o Buenos Aires sin un CP legible).
 *
 * Las listas de CP se pasan como argumento en lugar de leerlas acá: así la función queda pura
 * y el llamador decide de dónde vienen (hoy, de `envio_zonas`).
 */
export function resolverZona(
  provincia: string,
  codigoPostal: string,
  codigosPorZona: CodigosPorZona,
): string | null {
  const prov = slugProvincia(provincia)
  if (!prov) return null

  if (prov === ZONA_BUENOS_AIRES) {
    const cp = normalizarCP(codigoPostal)
    if (!cp) return null
    for (const zonaId of ZONAS_POR_CP) {
      if ((codigosPorZona[zonaId] || []).includes(cp)) return zonaId
    }
    return ZONA_BUENOS_AIRES_RESTO
  }

  return ZONA_IDS.has(prov) ? prov : null
}

/**
 * Limpia una lista de CP escrita a mano en el panel: acepta comas, espacios o saltos de línea,
 * descarta lo que no sean 4 dígitos y quita repetidos conservando el orden de carga.
 */
export function parsearCodigosPostales(texto: string): string[] {
  const vistos = new Set<string>()
  const limpios: string[] = []
  for (const parte of String(texto || '').split(/[\s,;]+/)) {
    const cp = parte.trim()
    if (!/^\d{4}$/.test(cp) || vistos.has(cp)) continue
    vistos.add(cp)
    limpios.push(cp)
  }
  return limpios
}
