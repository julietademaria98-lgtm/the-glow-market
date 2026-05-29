'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Curso } from '@/types'
import { formatPrice } from '@/lib/utils'
import StarIcon from '@/components/ui/StarIcon'
import CourseInfoDrawer from './CourseInfoDrawer'

interface CourseCardProps {
  curso: Curso
  index?: number
  hasAccess?: boolean
}

export default function CourseCard({ curso, index = 0, hasAccess = false }: CourseCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="group bg-white border border-glow-navy/10 hover:border-glow-navy/20 transition-all duration-500"
      >
        {/* Imagen */}
        <div className="relative aspect-video overflow-hidden">
          {curso.imagen_url ? (
            <>
              <Image
                src={curso.imagen_url}
                alt={curso.titulo}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-glow-navy/40 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-glow-navy flex flex-col items-center justify-center gap-4">
              <StarIcon size={28} className="text-white/20" />
              <span className="font-cormorant text-white/70 font-light text-center px-8 leading-tight text-2xl">
                {curso.titulo}
              </span>
            </div>
          )}
          {hasAccess && (
            <div className="absolute top-3 right-3 bg-glow-royal text-white font-montserrat text-[9px] tracking-widest uppercase px-3 py-1 flex items-center gap-1">
              <StarIcon size={8} /> Acceso activo
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-cormorant text-2xl text-glow-navy font-light tracking-wide leading-tight">
              {curso.titulo}
            </h3>
            {curso.descripcion && (
              <p className="font-montserrat text-xs text-glow-navy/60 leading-relaxed line-clamp-2">
                {curso.descripcion}
              </p>
            )}
          </div>

          {curso.lecciones && curso.lecciones.length > 0 && (
            <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/40">
              {curso.lecciones.length} lecciones
            </p>
          )}

          <div className="flex items-center justify-between mt-2 pt-4 border-t border-glow-navy/10">
            <span className="font-montserrat text-lg font-medium text-glow-navy">
              {formatPrice(curso.precio)}
            </span>
            {hasAccess ? (
              <a href="/mi-curso" className="font-montserrat text-[10px] tracking-[0.2em] uppercase bg-glow-navy text-white px-5 py-2.5 hover:bg-glow-navy/80 transition-colors">
                Acceder
              </a>
            ) : (
              <button
                onClick={() => setDrawerOpen(true)}
                className="font-montserrat text-[10px] tracking-[0.2em] uppercase bg-glow-navy text-white px-5 py-2.5 hover:bg-glow-navy/80 transition-colors"
              >
                Más info
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {drawerOpen && (
        <CourseInfoDrawer curso={curso} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  )
}
