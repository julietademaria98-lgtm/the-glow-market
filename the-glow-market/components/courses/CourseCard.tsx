'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Curso } from '@/types'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import StarIcon from '@/components/ui/StarIcon'

interface CourseCardProps {
  curso: Curso
  index?: number
  hasAccess?: boolean
}

export default function CourseCard({ curso, index = 0, hasAccess = false }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white border border-glow-navy/10 hover:border-glow-navy/20 transition-all duration-500"
    >
      {/* Imagen */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={curso.imagen_url || '/placeholder-course.jpg'}
          alt={curso.titulo}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-glow-navy/40 to-transparent" />
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

        {/* Lecciones count */}
        {curso.lecciones && curso.lecciones.length > 0 && (
          <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/40">
            {curso.lecciones.length} lecciones
          </p>
        )}

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-glow-navy/10">
          <div className="flex flex-col gap-0.5">
            {curso.precio_oferta ? (
              <>
                <span className="font-montserrat text-lg font-medium text-glow-navy">
                  {formatPrice(curso.precio_oferta)}
                </span>
                <span className="font-montserrat text-xs text-glow-navy/40 line-through">
                  {formatPrice(curso.precio)}
                </span>
              </>
            ) : (
              <span className="font-montserrat text-lg font-medium text-glow-navy">
                {formatPrice(curso.precio)}
              </span>
            )}
          </div>
          {hasAccess ? (
            <Link href="/mi-curso">
              <Button variant="primary" size="sm">
                Acceder
              </Button>
            </Link>
          ) : (
            <Link href={`/checkout?curso=${curso.id}`}>
              <Button variant="primary" size="sm">
                Comprar Curso
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
