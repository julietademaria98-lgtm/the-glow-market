'use client'

import Link from 'next/link'
import { Check, Play, ChevronLeft } from 'lucide-react'
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

  const modulosMap = new Map<string, Leccion[]>()
  sorted.forEach((l) => {
    const key = l.modulo || 'Módulo 1'
    if (!modulosMap.has(key)) modulosMap.set(key, [])
    modulosMap.get(key)!.push(l)
  })
  const modulos = Array.from(modulosMap.entries())

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 bg-glow-navy flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link
          href={`/mi-curso/curso/${curso.id}`}
          className="flex items-center gap-1.5 font-montserrat text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors mb-4"
        >
          <ChevronLeft size={12} />
          Ver overview
        </Link>
        <div className="flex items-center gap-2 mb-1.5">
          <StarIcon size={9} className="text-glow-blush" />
          <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-glow-blush">
            The Glow Market
          </span>
        </div>
        <h2 className="font-cormorant text-xl text-white font-light leading-tight">
          {curso.titulo}
        </h2>
        <p className="font-montserrat text-[10px] text-white/40 mt-1">
          {sorted.length} {sorted.length === 1 ? 'lección' : 'lecciones'}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {modulos.map(([nombreModulo, leccionesModulo], mi) => (
          <div key={nombreModulo} className="mb-1">
            <div className="px-6 pt-4 pb-2 flex items-center gap-2">
              <span className="font-cormorant text-base text-glow-blush/50 font-light">
                {String(mi + 1).padStart(2, '0')}
              </span>
              <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-white/30">
                {nombreModulo}
              </span>
            </div>

            {leccionesModulo.map((leccion) => {
              const isActive = leccion.id === activeLessonId
              const isCompleted = completedIds.includes(leccion.id)

              return (
                <Link
                  key={leccion.id}
                  href={`/mi-curso/${leccion.id}`}
                  className={`flex items-start gap-3 px-6 py-3.5 transition-all duration-200 border-l-2 ${
                    isActive
                      ? 'bg-white/10 border-glow-blush'
                      : 'border-transparent hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      isCompleted
                        ? 'bg-glow-blush'
                        : isActive
                        ? 'bg-white'
                        : 'border border-white/20'
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={10} className="text-glow-navy" />
                    ) : isActive ? (
                      <Play size={8} className="text-glow-navy fill-glow-navy" />
                    ) : (
                      <Play size={8} className="text-white/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-montserrat text-xs leading-relaxed ${
                        isActive ? 'text-white font-medium' : 'text-white/55'
                      }`}
                    >
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
          </div>
        ))}
      </nav>

    </aside>
  )
}
