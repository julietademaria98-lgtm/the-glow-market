'use client'

import Link from 'next/link'
import { Check, Lock, Play } from 'lucide-react'
import type { Leccion, Curso } from '@/types'
import StarIcon from '@/components/ui/StarIcon'

interface LessonSidebarProps {
  curso: Curso
  lecciones: Leccion[]
  activeLessonId: string
  completedIds?: string[]
}

export default function LessonSidebar({
  curso,
  lecciones,
  activeLessonId,
  completedIds = [],
}: LessonSidebarProps) {
  const sorted = [...lecciones].sort((a, b) => a.orden - b.orden)

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 bg-glow-navy flex flex-col">
      {/* Course title */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <StarIcon size={10} className="text-glow-blush" />
          <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-glow-blush">
            The Glow Market
          </span>
        </div>
        <h2 className="font-cormorant text-xl text-white font-light leading-tight">
          {curso.titulo}
        </h2>
        <p className="font-montserrat text-[10px] text-white/40 mt-1">
          {sorted.length} lecciones
        </p>
      </div>

      {/* Lessons list */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sorted.map((leccion, i) => {
          const isActive = leccion.id === activeLessonId
          const isCompleted = completedIds.includes(leccion.id)
          const isLocked = !leccion.es_preview

          return (
            <Link
              key={leccion.id}
              href={`/mi-curso/${leccion.id}`}
              className={`flex items-start gap-3 px-6 py-4 transition-all duration-200 border-l-2 ${
                isActive
                  ? 'bg-white/10 border-glow-blush'
                  : 'border-transparent hover:bg-white/5 hover:border-white/20'
              }`}
            >
              {/* State icon */}
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  isCompleted
                    ? 'bg-glow-blush'
                    : isActive
                    ? 'bg-white'
                    : 'border border-white/30'
                }`}
              >
                {isCompleted ? (
                  <Check size={10} className="text-glow-navy" />
                ) : isActive ? (
                  <Play size={8} className="text-glow-navy fill-glow-navy" />
                ) : isLocked ? (
                  <Lock size={8} className="text-white/40" />
                ) : (
                  <Play size={8} className="text-white/40" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-montserrat text-xs leading-relaxed ${
                    isActive ? 'text-white font-medium' : 'text-white/60'
                  }`}
                >
                  <span className="text-white/30 mr-1">{String(i + 1).padStart(2, '0')}.</span>
                  {leccion.titulo}
                </p>
                {leccion.duracion && (
                  <span className="font-montserrat text-[9px] text-white/30 mt-0.5 block">
                    {leccion.duracion}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
