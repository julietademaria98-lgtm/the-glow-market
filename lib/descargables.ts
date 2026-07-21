export interface Descargable {
  titulo: string
  subtitulo: string
  filename: string
  notaExtra?: string
}

// Mapeo por modulo_orden (0 = Bienvenida, 1 = Módulo 1, 2 = Módulo 2, etc.)
const DESCARGABLES_POR_ORDEN: Record<number, Descargable[]> = {
  0: [
    {
      titulo: 'Kit Esencial',
      subtitulo: 'Lista completa de productos Clarins por módulo',
      filename: 'kit-esencial.pdf',
      notaExtra: 'Consultalo desde cualquier módulo del curso',
    },
  ],
  1: [
    {
      titulo: 'Diagnóstico de Piel',
      subtitulo: 'Test de 6 preguntas para identificar tu tipo de piel',
      filename: 'diagnostico-piel.pdf',
      notaExtra: 'Hacelo antes de empezar la rutina del Módulo 1',
    },
  ],
  2: [
    {
      titulo: 'Guía de Subtono',
      subtitulo: 'Elegí la base correcta para tu tono de piel',
      filename: 'guia-subtono.pdf',
    },
    {
      titulo: 'SOS Primer: Según Cada Color',
      subtitulo: 'Los 5 colores del SOS Primer y cómo usarlos',
      filename: 'sos-primer-colores.pdf',
    },
    {
      titulo: 'Bronzer por Tipo de Cara',
      subtitulo: 'Aplicación personalizada según tu forma de rostro',
      filename: 'bronzer-tipo-cara.pdf',
    },
  ],
  4: [
    {
      titulo: 'Bronzer por Tipo de Cara',
      subtitulo: 'Aplicación personalizada según tu forma de rostro',
      filename: 'bronzer-tipo-cara.pdf',
      notaExtra: 'El mismo descargable del Módulo 2 — lo usás también acá',
    },
  ],
}

// Fallback por nombre de módulo si modulo_orden no está seteado
const MODULO_KEYWORDS: { keywords: string[]; orden: number }[] = [
  { keywords: ['bienvenida', 'intro', 'módulo 0', 'modulo 0'], orden: 0 },
  { keywords: ['piel', 'hidratada', 'skincare', 'módulo 1', 'modulo 1'], orden: 1 },
  { keywords: ['makeup', 'maquillaje', 'día', 'dia', 'básico', 'basico', 'módulo 2', 'modulo 2'], orden: 2 },
]

export function getDescargablesByModulo(
  moduloOrden: number | null,
  moduloNombre: string | null
): Descargable[] {
  if (moduloOrden !== null && moduloOrden !== undefined) {
    return DESCARGABLES_POR_ORDEN[moduloOrden] || []
  }

  if (moduloNombre) {
    const lower = moduloNombre.toLowerCase()
    for (const { keywords, orden } of MODULO_KEYWORDS) {
      if (keywords.some((k) => lower.includes(k))) {
        return DESCARGABLES_POR_ORDEN[orden] || []
      }
    }
  }

  return []
}

export const KIT_ESENCIAL: Descargable = {
  titulo: 'Kit Esencial',
  subtitulo: 'Lista completa de productos por módulo',
  filename: 'kit-esencial.pdf',
}
