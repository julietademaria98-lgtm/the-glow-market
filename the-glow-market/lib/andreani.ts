import type { DatosEnvio } from '@/types'

export interface AndreaniConfig {
  base_url: string
  usuario: string
  password: string
  contrato: string
  cp_origen: string
  sucursal_origen: string | null
  // Opcionales que da Andreani (se cargan en el panel cuando estén disponibles).
  tipo_servicio?: string | null
  sucursal_cliente_id?: string | null
}

// Andreani acepta el token como Bearer o como x-authorization-token según la versión;
// mandamos ambos para no depender de eso.
function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'x-authorization-token': token,
  }
}

export interface CotizacionInput {
  cpDestino: string
  kilos: number
  volumen?: number
  valorDeclarado: number
}

export interface CotizacionResult {
  tarifaConIva: number
  tarifaSinIva: number
  raw: unknown
}

interface CachedToken { token: string; expiresAt: number }
const tokenCache = new Map<string, CachedToken>()

function cacheKey(cfg: AndreaniConfig) {
  return `${cfg.base_url}::${cfg.usuario}`
}

function stripSlash(url: string) {
  return url.replace(/\/+$/, '')
}

export async function getToken(cfg: AndreaniConfig): Promise<string> {
  const key = cacheKey(cfg)
  const cached = tokenCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.token

  // Login: POST /login con cuerpo JSON { userName, password } (confirmado por la respuesta real
  // de Andreani: exige el campo "userName").
  const res = await fetch(`${stripSlash(cfg.base_url)}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ userName: cfg.usuario, password: cfg.password }),
    signal: AbortSignal.timeout(10_000),
  })
  const rawBody = await res.text().catch(() => '')
  if (!res.ok) {
    throw new Error(`Login Andreani falló (${res.status})${rawBody ? `: ${rawBody}` : ''}`)
  }

  // El token puede venir en el header x-authorization-token o en el cuerpo JSON.
  let token = res.headers.get('x-authorization-token') || ''
  if (!token && rawBody) {
    try {
      const j = JSON.parse(rawBody) as Record<string, unknown>
      token = String(j.token || j.jwt || j.accessToken || j.access_token || j.Token || '')
    } catch {
      /* cuerpo no-JSON: se queda sin token y avisa abajo */
    }
  }
  if (!token) throw new Error(`Login OK pero Andreani no devolvió token. Respuesta: ${rawBody}`)

  // JWT vive ~1h. Cacheamos 50 min para tener margen.
  tokenCache.set(key, { token, expiresAt: Date.now() + 50 * 60 * 1000 })
  return token
}

export async function ping(cfg: AndreaniConfig): Promise<void> {
  await getToken(cfg)
}

export function invalidateTokenCache(cfg: AndreaniConfig) {
  tokenCache.delete(cacheKey(cfg))
}

// ============================================
// ALTA DE ENVÍO + ETIQUETA
// ============================================

export interface EnvioInput {
  // Destinatario
  nombre: string
  apellido: string
  dni: string
  email?: string
  telefono?: string
  // Dirección de destino
  direccion: string // calle + número en texto libre (datos_envio.direccion)
  localidad: string
  provincia: string
  cpDestino: string
  // Paquete
  kilos: number
  valorDeclarado: number
  volumen?: number
}

export interface EnvioResult {
  numeroAndreani: string
  agrupadorDeBultos?: string
  etiquetasLink?: string // etiquetasPorAgrupador que devuelve el alta
  raw: unknown
}

// Mapea los datos de envío de una orden + los extras cargados a mano (peso/DNI/valor).
export function envioInputFromDatosEnvio(
  d: DatosEnvio,
  extra: { kilos: number; dni: string; valorDeclarado: number; volumen?: number },
): EnvioInput {
  return {
    nombre: d.nombre,
    apellido: d.apellido,
    dni: extra.dni,
    email: d.email,
    telefono: d.telefono,
    direccion: d.direccion,
    localidad: d.ciudad,
    provincia: d.provincia,
    cpDestino: d.codigo_postal,
    kilos: extra.kilos,
    valorDeclarado: extra.valorDeclarado,
    volumen: extra.volumen,
  }
}

// La dirección viene como texto libre; separamos un número al final si existe.
function splitDireccion(direccion: string): { calle: string; numero: string } {
  const m = direccion.trim().match(/^(.*?)[\s,]+(\d+\S*)$/)
  if (m) return { calle: m[1].trim(), numero: m[2].trim() }
  return { calle: direccion.trim(), numero: 'S/N' }
}

function buildEnvioBody(cfg: AndreaniConfig, input: EnvioInput) {
  const { calle, numero } = splitDireccion(input.direccion)
  const bulto: Record<string, unknown> = {
    kilos: input.kilos,
    valorDeclarado: input.valorDeclarado,
    ...(input.volumen ? { volumenCm: input.volumen } : {}),
  }
  return {
    contrato: cfg.contrato,
    ...(cfg.tipo_servicio ? { tipoDeServicio: cfg.tipo_servicio } : {}),
    // sucursalClienteID: el schema oficial lo tipa como número.
    ...(cfg.sucursal_cliente_id ? { sucursalClienteID: Number(cfg.sucursal_cliente_id) } : {}),
    origen: {
      postal: { codigoPostal: cfg.cp_origen, pais: 'Argentina' },
      ...(cfg.sucursal_origen ? { sucursal: { id: cfg.sucursal_origen } } : {}),
    },
    destino: {
      postal: {
        codigoPostal: input.cpDestino,
        calle,
        numero,
        localidad: input.localidad,
        region: input.provincia,
        pais: 'Argentina',
      },
    },
    destinatario: [
      {
        nombreCompleto: `${input.nombre} ${input.apellido}`.trim(),
        documentoTipo: 'DNI',
        documentoNumero: input.dni,
        ...(input.email ? { email: input.email } : {}),
        ...(input.telefono ? { telefonos: [{ tipo: 1, numero: input.telefono }] } : {}),
      },
    ],
    bultos: [bulto],
  }
}

export async function crearEnvio(cfg: AndreaniConfig, input: EnvioInput): Promise<EnvioResult> {
  const token = await getToken(cfg)
  const body = buildEnvioBody(cfg, input)

  // API clásica v2: POST /v2/ordenes-de-envio (host apis.andreani.com / QA apisqa.andreani.com).
  const res = await fetch(`${stripSlash(cfg.base_url)}/v2/ordenes-de-envio`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  })
  const text = await res.text()
  let raw: unknown
  try { raw = JSON.parse(text) } catch { raw = text }
  if (!res.ok) throw new Error(`Alta de envío Andreani falló (${res.status}): ${text}`)

  // El alta devuelve bultos[].numeroDeEnvio (confirmado en doc oficial), más agrupadorDeBultos
  // y etiquetasPorAgrupador (link a las etiquetas).
  const anyRaw = raw as Record<string, unknown>
  const bultos = anyRaw?.bultos as Array<Record<string, unknown>> | undefined
  const numeroAndreani =
    (bultos?.[0]?.numeroDeEnvio as string | undefined) ||
    (anyRaw?.numeroDeEnvio as string | undefined) ||
    ''
  if (!numeroAndreani) throw new Error(`Andreani no devolvió un número de envío. Respuesta: ${text}`)

  return {
    numeroAndreani,
    agrupadorDeBultos: anyRaw?.agrupadorDeBultos as string | undefined,
    etiquetasLink: anyRaw?.etiquetasPorAgrupador as string | undefined,
    raw,
  }
}

export interface EtiquetaResult {
  pdf: ArrayBuffer
  contentType: string
}

// La etiqueta NO tiene endpoint propio en la doc oficial: el alta devuelve el string
// `etiquetasPorAgrupador`. La doc no confirma si es una URL a PDF o un token → si es una URL,
// la descargamos (con auth por las dudas). Si no lo es, avisamos para confirmar en QA.
export async function getEtiqueta(cfg: AndreaniConfig, etiquetasLink: string): Promise<EtiquetaResult> {
  if (!etiquetasLink) throw new Error('Este envío no tiene link de etiqueta (etiquetasPorAgrupador)')
  if (!/^https?:\/\//i.test(etiquetasLink)) {
    throw new Error(
      `El valor de etiqueta no es una URL descargable: "${etiquetasLink}". Confirmá el formato con Andreani (QA).`,
    )
  }
  const token = await getToken(cfg)
  const res = await fetch(etiquetasLink, {
    headers: authHeaders(token),
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Etiqueta Andreani falló (${res.status})${body ? `: ${body}` : ''}`)
  }
  const contentType = res.headers.get('content-type') || 'application/pdf'
  const pdf = await res.arrayBuffer()
  return { pdf, contentType }
}

// ============================================
// TRAZAS / SEGUIMIENTO
// ============================================

export interface Traza {
  fecha: string | null
  estado: string
  evento: string | null
  sucursal: string | null
}

// GET /v2/envios/{numeroAndreani}/trazas — API de tracking (host propio, ver trazas_base_url).
// Respuesta oficial (api-tracking.xlsx): array de { Fecha, Estado, Evento, EstadoId, Sucursal }.
export async function getTrazas(cfg: AndreaniConfig, numeroAndreani: string): Promise<Traza[]> {
  const token = await getToken(cfg)
  const res = await fetch(
    `${stripSlash(cfg.base_url)}/v2/envios/${encodeURIComponent(numeroAndreani)}/trazas`,
    {
      headers: authHeaders(token),
      signal: AbortSignal.timeout(10_000),
    },
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`Trazas Andreani falló (${res.status}): ${text}`)
  let raw: unknown
  try { raw = JSON.parse(text) } catch { raw = text }

  // La respuesta es un array; contemplamos envolturas por si el ambiente difiere.
  const asArr = (v: unknown) => (Array.isArray(v) ? (v as Array<Record<string, unknown>>) : null)
  const obj = raw as Record<string, unknown>
  const arr = asArr(raw) ?? asArr(obj?.eventos) ?? asArr(obj?.trazas) ?? asArr(obj?.Eventos) ?? []

  const str = (v: unknown): string | null => (v == null ? null : String(v))
  const sucursalOf = (v: unknown): string | null => {
    if (v == null) return null
    if (typeof v === 'object' && 'nombre' in (v as object)) return str((v as Record<string, unknown>).nombre)
    return String(v)
  }
  return arr.map((e) => ({
    // Campos oficiales en PascalCase; toleramos minúscula por las dudas.
    fecha: str(e.Fecha ?? e.fecha),
    estado: String(e.Estado ?? e.estado ?? '—'),
    evento: str(e.Evento ?? e.evento),
    sucursal: sucursalOf(e.Sucursal ?? e.sucursal),
  }))
}

export async function cotizar(
  cfg: AndreaniConfig,
  input: CotizacionInput,
): Promise<CotizacionResult> {
  const token = await getToken(cfg)

  // API clásica: GET /v1/tarifas con params en notación bracket (api-cotizador-v2-1.xlsx).
  const params = new URLSearchParams({
    contrato: cfg.contrato,
    cpDestino: input.cpDestino,
    ...(cfg.sucursal_origen ? { sucursalOrigen: cfg.sucursal_origen } : {}),
    'bultos[0][kilos]': String(input.kilos),
    'bultos[0][valorDeclarado]': String(input.valorDeclarado),
    ...(input.volumen ? { 'bultos[0][volumen]': String(input.volumen) } : {}),
  })

  const res = await fetch(`${stripSlash(cfg.base_url)}/v1/tarifas?${params}`, {
    headers: authHeaders(token),
    signal: AbortSignal.timeout(10_000),
  })
  const text = await res.text()
  let raw: unknown
  try { raw = JSON.parse(text) } catch { raw = text }
  if (!res.ok) throw new Error(`Cotización Andreani falló (${res.status}): ${text}`)

  // Respuesta oficial: { pesoAforado, tarifaSinIva:{total}, tarifaConIva:{total} } (totales como string).
  const anyRaw = raw as Record<string, unknown>
  const readTotal = (v: unknown): number => {
    if (typeof v === 'number') return v
    if (typeof v === 'string') return Number(v) || 0
    if (v && typeof v === 'object' && 'total' in v) return Number((v as { total: unknown }).total) || 0
    return 0
  }
  return {
    tarifaConIva: readTotal(anyRaw?.tarifaConIva),
    tarifaSinIva: readTotal(anyRaw?.tarifaSinIva),
    raw,
  }
}
