'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

const PERSONAS = [
  { nombre: 'Valentina', ciudad: 'Córdoba' },
  { nombre: 'Martina', ciudad: 'CABA' },
  { nombre: 'Sofía', ciudad: 'Rosario' },
  { nombre: 'Camila', ciudad: 'Mendoza' },
  { nombre: 'Agustina', ciudad: 'La Plata' },
  { nombre: 'Julieta', ciudad: 'Mar del Plata' },
  { nombre: 'Lucía', ciudad: 'Tucumán' },
  { nombre: 'Florencia', ciudad: 'Salta' },
  { nombre: 'Milagros', ciudad: 'San Isidro' },
  { nombre: 'Catalina', ciudad: 'Neuquén' },
  { nombre: 'Pilar', ciudad: 'Vicente López' },
  { nombre: 'Emilia', ciudad: 'Santa Fe' },
  { nombre: 'Josefina', ciudad: 'Bahía Blanca' },
  { nombre: 'Delfina', ciudad: 'CABA' },
  { nombre: 'Micaela', ciudad: 'San Juan' },
]

function minutosAleatorios() {
  const min = Math.floor(Math.random() * 14) + 1
  return min === 1 ? 'hace 1 minuto' : `hace ${min} minutos`
}

interface Toast {
  id: number
  nombre: string
  ciudad: string
  tipo: 'compra' | 'viendo'
  hace: string
}

export default function SocialProofPopup({ cursoNombre }: { cursoNombre: string }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    let showTimer: ReturnType<typeof setTimeout>
    let hideTimer: ReturnType<typeof setTimeout>
    let cancelled = false

    const cycle = (delay: number) => {
      showTimer = setTimeout(() => {
        if (cancelled) return
        const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]
        const tipo: Toast['tipo'] = Math.random() > 0.5 ? 'compra' : 'viendo'
        setToast({
          id: Date.now(),
          nombre: persona.nombre,
          ciudad: persona.ciudad,
          tipo,
          hace: minutosAleatorios(),
        })
        hideTimer = setTimeout(() => {
          if (cancelled) return
          setToast(null)
          cycle(6000 + Math.random() * 6000)
        }, 4500)
      }, delay)
    }

    cycle(4000)

    return () => {
      cancelled = true
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [dismissed])

  if (dismissed) return null

  return (
    <div className="fixed bottom-5 left-5 z-40 w-[260px] pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white shadow-lg border border-glow-navy/10 px-4 py-3 flex items-start gap-3 pointer-events-auto"
          >
            <span
              className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                toast.tipo === 'compra' ? 'bg-glow-blush' : 'bg-green-500 animate-pulse'
              }`}
            />
            <div className="flex-1">
              <p className="font-montserrat text-xs text-glow-navy leading-snug">
                <span className="font-medium">{toast.nombre}</span>{' '}
                <span className="text-glow-navy/50">de {toast.ciudad}</span>
                {toast.tipo === 'compra' ? (
                  <>
                    {
