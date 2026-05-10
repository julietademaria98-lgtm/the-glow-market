'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Curso } from '@/types'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface CoursesSectionProps {
  cursos: Curso[]
}

export default function CoursesSection({ cursos }: CoursesSectionProps) {
  return (
    <section className="bg-glow-navy py-24 px-6">
      <div className="max-w-[1400px] mx-auto">

        {/* Header con logo + título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-16 mb-16"
        >
          {/* Logo circular */}
          <div className="shrink-0">
            <Image
              src="/images/Recurso 20Iso (1).png"
              alt="The Glow Market"
              width={160}
              height={160}
              className="w-24 md:w-36 lg:w-40 object-contain opacity-90"
            />
          </div>

          {/* Título */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/40 text-[10px]">+</span>
              <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-white/40">
                Formación Exclusiva
              </span>
              <span className="text-white/40 text-[10px]">+</span>
            </div>
            <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-wide uppercase">
              Cursos Online
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="font-cormorant italic text-white/50" style={{ fontSize: '20px' }}>
                Sponsored by
              </p>
              <Image
                src="/images/Clarins.svg.png"
                alt="Clarins"
                width={80}
                height={24}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }}
              />
            </div>
          </div>
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
            className="font-montserrat text-xs tracking-[0.2em] uppercase text-white/60 border-b border-white/20 hover:text-white hover:border-white pb-0.5 transition-colors duration-300"
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
          <span className="font-montserrat text-sm font-medium text-white/70">
            {formatPrice(curso.precio)}
          </span>
          <Link href="/cursos">
            <Button variant="outline-white" size="sm">
              Ver Curso
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
