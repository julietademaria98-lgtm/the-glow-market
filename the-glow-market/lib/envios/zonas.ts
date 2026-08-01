/**
 * Zonas de envío: dado provincia + código postal, decide a qué zona pertenece una dirección.
 *
 * Acá NO hay precios ni textos. El nombre, la descripción y el precio de cada zona los carga
 * el admin y viven en la tabla `envio_zonas`. Este archivo solo resuelve la pertenencia
 * geográfica, que es un hecho y no una decisión comercial.
 *
 * Buenos Aires se parte en tres zonas según el CP; el resto del país matchea por provincia.
 */

// Los rangos de GBA y GBA2 se entrelazan (GBA llega a 1893, GBA2 tiene el 1984), así que el
// matcheo es contra listas explícitas. Un rango numérico daría zonas equivocadas.

/** Códigos postales de GBA (166). */
const CP_GBA = new Set([
  '1602', '1603', '1604', '1605', '1606', '1607', '1608', '1609', '1610', '1611',
  '1612', '1613', '1614', '1615', '1616', '1617', '1618', '1621', '1624', '1636',
  '1637', '1638', '1640', '1641', '1642', '1643', '1644', '1645', '1646', '1648',
  '1650', '1651', '1653', '1659', '1660', '1661', '1662', '1663', '1665', '1666',
  '1667', '1670', '1672', '1674', '1675', '1676', '1678', '1682', '1684', '1685',
  '1686', '1687', '1688', '1689', '1690', '1692', '1702', '1703', '1704', '1706',
  '1707', '1708', '1712', '1713', '1714', '1715', '1716', '1718', '1721', '1722',
  '1723', '1724', '1739', '1741', '1745', '1751', '1752', '1753', '1754', '1755',
  '1757', '1758', '1759', '1761', '1763', '1764', '1765', '1766', '1768', '1770',
  '1772', '1773', '1774', '1776', '1778', '1785', '1786', '1801', '1802', '1803',
  '1804', '1805', '1806', '1807', '1809', '1812', '1820', '1822', '1823', '1824',
  '1825', '1826', '1828', '1829', '1832', '1833', '1834', '1836', '1837', '1838',
  '1839', '1840', '1841', '1842', '1843', '1844', '1845', '1846', '1847', '1848',
  '1849', '1851', '1852', '1853', '1854', '1855', '1856', '1857', '1859', '1861',
  '1867', '1868', '1869', '1870', '1871', '1872', '1873', '1874', '1875', '1876',
  '1877', '1878', '1879', '1880', '1881', '1882', '1883', '1884', '1885', '1886',
  '1887', '1888', '1889', '1890', '1891', '1893',
])

/** Códigos postales de GBA2 (37). */
const CP_GBA2 = new Set([
  '1619', '1620', '1623', '1625', '1626', '1627', '1628', '1629', '1630', '1632',
  '1633', '1634', '1635', '1664', '1669', '1727', '1747', '1748', '1749', '1750',
  '1781', '1782', '1783', '1784', '1787', '1789', '1790', '1791', '1792', '1793',
  '1835', '1858', '1862', '1864', '1865', '1866', '1984',
])

export type GrupoZona = 'buenos-aires' | 'provincia'

export interface Zona {
  id: string
  grupo: GrupoZona
  /**
   * Etiqueta interna, solo para que el admin identifique la fila en el panel. Lo que ve el
   * comprador es siempre el `nombre` que se carga en la base.
   */
  etiqueta: string
  /**
   * Los CP que componen la zona, para mostrarlos en el panel: sin esto el admin no puede
   * saber qué está cubriendo cuando le pone precio a "GBA". Solo las zonas que matchean por
   * lista; "Resto de Buenos Aires" es el complemento y no tiene una lista propia.
   */
  codigosPostales?: string[]
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

/** Extrae los 4 dígitos del CP. Acepta '1602' y el formato CPA 'B1602ABC'. */
export function normalizarCP(valor: string): string | null {
  const match = String(valor || '').match(/\d{4}/)
  return match ? match[0] : null
}

export const ZONA_BUENOS_AIRES = 'buenos-aires'

/** Las 26 zonas: 3 de Buenos Aires + 23 provincias. */
export const ZONAS: Zona[] = [
  { id: 'gba', grupo: 'buenos-aires', etiqueta: 'GBA', codigosPostales: Array.from(CP_GBA) },
  { id: 'gba2', grupo: 'buenos-aires', etiqueta: 'GBA2', codigosPostales: Array.from(CP_GBA2) },
  { id: 'bsas-resto', grupo: 'buenos-aires', etiqueta: 'Resto de Buenos Aires' },
  ...PROVINCIAS_POR_NOMBRE.map((p): Zona => ({
    id: slugProvincia(p),
    grupo: 'provincia',
    etiqueta: p,
  })),
]

const ZONA_IDS = new Set(ZONAS.map((z) => z.id))

/**
 * Devuelve el id de zona para una dirección, o null si no se puede determinar
 * (provincia desconocida, o Buenos Aires sin un CP legible).
 */
export function resolverZona(provincia: string, codigoPostal: string): string | null {
  const prov = slugProvincia(provincia)
  if (!prov) return null

  if (prov === ZONA_BUENOS_AIRES) {
    const cp = normalizarCP(codigoPostal)
    if (!cp) return null
    if (CP_GBA.has(cp)) return 'gba'
    if (CP_GBA2.has(cp)) return 'gba2'
    // Cualquier otro CP bonaerense cae en el resto de la provincia.
    return 'bsas-resto'
  }

  return ZONA_IDS.has(prov) ? prov : null
}
