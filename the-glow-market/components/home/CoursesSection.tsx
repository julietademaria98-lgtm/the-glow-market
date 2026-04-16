'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Curso } from '@/types'
import { formatPrice } from '@/lib/utils'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

interface CoursesSectionProps {
  cursos: Curso[]
}

export default function CoursesSection({ cursos }: CoursesSectionProps) {
  return (
    <section className="bg-glow-navy py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarIcon size={10} className="text-glow-blush" />
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-blush">
              Formación Exclusiva
            </span>
            <StarIcon size={10} className="text-glow-blush" />
          </div>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-wide">
            Cursos Online
          </h2>
          <p className="font-montserrat text-sm text-white/60 mt-4 max-w-md mx-auto leading-relaxed">
            Aprendé a brillar con The Glow Market
          </p>
        </motion.div>

        {/* Course cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cursos.map((curso, i) => (
            <CourseCard key={curso.id} curso={curso} index={i} />
          ))}
        </div>

        {/* CTA secundario */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <p className="font-montserrat text-sm text-white/50 mb-2">
            ¿Ya sos alumna?
          </p>
          <Link
            href="/login"
            className="font-montserrat text-xs tracking-[0.2em] uppercase text-glow-blush border-b border-glow-blush/40 hover:border-glow-blush pb-0.5 transition-colors duration-300"
          >
            Ingresar aquí →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function CourseCard({ curso, index }: { curso: Curso; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-glow-dark/60 border border-white/10 hover:border-white/20 transition-all duration-500"
    >
      {/* Imagen */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={curso.imagen_url || '/placeholder-course.jpg'}
          alt={curso.titulo}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-glow-dark/60 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-4">
        <h3 className="font-cormorant text-2xl text-white font-light tracking-wide leading-tight">
          {curso.titulo}
        </h3>
        {curso.descripcion && (
          <p className="font-montserrat text-xs text-white/60 leading-relaxed line-clamp-2">
            {curso.descripcion}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-montserrat text-sm font-medium text-glow-blush">
            {formatPrice(curso.precio)}
          </span>
          <Link href={`/cursos`}>
            <Button variant="outline-white" size="sm">
              Ver Curso
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
