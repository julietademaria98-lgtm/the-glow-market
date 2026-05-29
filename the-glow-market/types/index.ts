// ============================================
// PRODUCTO
// ============================================
export interface Producto {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  precio: number
  precio_oferta: number | null
  categoria: string
  material: string | null
  dimensiones: string | null
  peso: string | null
  colores: string[] | null
  stock: number
  activo: boolean
  destacado: boolean
  created_at: string
  imagenes?: ProductoImagen[]
}

export interface ProductoImagen {
  id: string
  producto_id: string
  url: string
  orden: number
  es_principal: boolean
}

// ============================================
// CURSOS
// ============================================
export interface Curso {
  id: string
  slug: string
  titulo: string
  descripcion: string | null
  descripcion_larga: string | null
  precio: number
  precio_oferta: number | null
  imagen_url: string | null
  activo: boolean
  created_at: string
  lecciones?: Leccion[]
}

export interface Leccion {
  id: string
  curso_id: string
  titulo: string
  descripcion: string | null
  video_path: string
  duracion: string | null
  orden: number
  es_preview: boolean
  curso?: Curso
}

export interface AccesoCurso {
  id: string
  user_id: string
  curso_id: string
  activo: boolean
  created_at: string
}

// ============================================
// ÓRDENES
// ============================================
export type EstadoOrden = 'pendiente' | 'aprobado' | 'rechazado' | 'en_proceso'

export interface DatosEnvio {
  nombre: string
  apellido: string
  email: string
  telefono: string
  provincia: string
  ciudad: string
  direccion: string
  codigo_postal: string
  notas?: string
}

export interface OrdenItem {
  id: string
  slug: string
  nombre: string
  precio: number
  cantidad: number
  imagen_url: string
}

export interface Orden {
  id: string
  user_id: string | null
  mp_preference_id: string | null
  mp_payment_id: string | null
  estado: EstadoOrden
  total: number
  items: OrdenItem[]
  datos_envio: DatosEnvio | null
  created_at: string
}

// ============================================
// CART
// ============================================
export interface CartItem {
  id: string
  slug: string
  nombre: string
  precio: number
  imagen_url: string
  quantity: number
}

// ============================================
// MERCADOPAGO
// ============================================
export interface MPWebhookData {
  action: string
  api_version: string
  data: { id: string }
  date_created: string
  id: number
  live_mode: boolean
  type: string
  user_id: string
}

// ============================================
// USER / AUTH
// ============================================
export interface UserProfile {
  id: string
  email: string
  nombre?: string
  apellido?: string
}
