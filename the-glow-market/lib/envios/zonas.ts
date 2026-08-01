/**
 * Zonas de envío: dado provincia + código postal, decide a qué zona pertenece una dirección.
 *
 * Las zonas no están definidas acá: las crea el admin y viven en la tabla `envio_zonas`. Este
 * archivo solo tiene la mecánica del matcheo y la lista de provincias del país, que es lo
 * único que no depende de cómo esté configurada la tienda.
 *
 * El orden de evaluación va de lo más específico a lo más general, y es automático para que no
 * se pueda dejar una zona tapada por otra:
 *
 *   1. Zonas con códigos postales   (GBA 1, GBA 2)
 *   2. Zonas por provincia          (CABA, Tucumán)
 *   3. Resto de Buenos Aires        (descarte, solo si la provincia es Buenos Aires)
 *   4. Resto del país               (descarte final: nunca queda una dirección sin zona)
 */

/** Las 24 jurisdicciones del país, tal como aparecen en el checkout. */
export const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
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
 * numéricos: no se acepta el formato CPA con letras ('B1602ABC').
 */
export function normalizarCP(valor: string): string | null {
  const limpio = String(valor || '').trim()
  return /^\d{4}$/.test(limpio) ? limpio : null
}

/** Provincia cuyo descarte es "Resto de Buenos Aires". */
export const PROVINCIA_BUENOS_AIRES = slugProvincia('Buenos Aires')

/**
 * Qué clase de zona es. Los dos descartes son únicos, no se borran y no se les elige región:
 * se calculan con lo que no cubran las demás, y por eso ninguna dirección queda sin zona.
 */
export type TipoZona = 'normal' | 'resto-bsas' | 'resto-pais'

export interface Zona {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  activo: boolean
  tipo: TipoZona
  /** Slugs de provincia que cubre. Vacío en los descartes. */
  provincias: string[]
  /** Si tiene, la zona cubre solo esos CP dentro de sus provincias. */
  codigosPostales: string[]
}

/** Una zona sirve si está prendida y tiene nombre: sin nombre no hay qué mostrarle al comprador. */
export function estaConfigurada(zona?: Zona | null): boolean {
  return Boolean(zona && zona.activo && zona.nombre.trim())
}

/**
 * Elige la zona que corresponde a una dirección, o null si no se puede determinar (sin
 * provincia, o Buenos Aires sin un CP legible).
 *
 * Solo se consideran las zonas configuradas: una zona apagada es como si no existiera, así que
 * sus direcciones caen en la zona más general que las contenga.
 */
export function resolverZona(
  provincia: string,
  codigoPostal: string,
  zonas: Zona[],
): Zona | null {
  const prov = slugProvincia(provincia)
  if (!prov) return null

  const cp = normalizarCP(codigoPostal)
  const usables = zonas.filter(estaConfigurada)

  const cubreProvincia = (z: Zona) => z.provincias.length === 0 || z.provincias.includes(prov)

  // Dentro de cada nivel gana la zona que abarca menos: una que cubre solo Córdoba tiene que
  // ganarle a una que cubre veinte provincias, sin importar cuál se creó antes.
  const masChicaPrimero = (a: Zona, b: Zona) => a.provincias.length - b.provincias.length

  // 1. Lo más específico: zonas que enumeran códigos postales.
  const porCP = usables
    .filter((z) => z.tipo === 'normal' && z.codigosPostales.length > 0)
    .sort((a, b) => a.codigosPostales.length - b.codigosPostales.length)
  if (cp) {
    for (const zona of porCP) {
      if (cubreProvincia(zona) && zona.codigosPostales.includes(cp)) return zona
    }
  }

  // 2. Zonas que cubren provincias enteras.
  const porProvincia = usables
    .filter((z) => z.tipo === 'normal' && z.codigosPostales.length === 0 && z.provincias.length > 0)
    .sort(masChicaPrimero)
  for (const zona of porProvincia) {
    if (zona.provincias.includes(prov)) return zona
  }

  // 3 y 4. Descartes. Buenos Aires tiene el suyo; todo lo demás cae en el del país.
  if (prov === PROVINCIA_BUENOS_AIRES) {
    const restoBsAs = usables.find((z) => z.tipo === 'resto-bsas')
    if (restoBsAs) return restoBsAs
  }
  return usables.find((z) => z.tipo === 'resto-pais') ?? null
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

/** Texto corto de qué cubre una zona, para la lista del panel. */
export function describirCobertura(zona: Zona): string {
  if (zona.tipo === 'resto-bsas') return 'Todo Buenos Aires que no cubran las zonas de arriba'
  if (zona.tipo === 'resto-pais') return 'Todo lo que no cubra ninguna otra zona'

  const provincias = zona.provincias
    .map((slug) => PROVINCIAS.find((p) => slugProvincia(p) === slug) ?? slug)
    .join(', ')

  if (zona.codigosPostales.length > 0) {
    const donde = provincias ? ` de ${provincias}` : ''
    return `${zona.codigosPostales.length} códigos postales${donde}`
  }
  return provincias || 'Sin región asignada'
}
