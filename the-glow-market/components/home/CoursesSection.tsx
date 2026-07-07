'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Curso } from '@/types'
import { formatPrice } from '@/lib/utils'
import CourseInfoDrawer from '@/components/courses/CourseInfoDrawer'

interface CoursesSectionProps {
  cursos: Curso[]
}

export default function CoursesSection({ cursos }: CoursesSectionProps) {
  return (
    <section>
      {/* Banner navy */}
      <div className="bg-glow-navy py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="font-cormorant text-white font-light tracking-[0.15em] uppercase"
            style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}
          >
            Curso Online
          </h2>
          <p className="font-montserrat text-xs md:text-sm tracking-[0.3em] uppercase text-white/70 mt-4">
            Formación Exclusiva Sponsored By{' '}
            <span className="font-bold text-white">Clarins</span>
          </p>
        </motion.div>
      </div>

      {/* Cards sobre fondo cream */}
      <div className="bg-glow-cream py-16 px-6">
        <div className="max-w-[520px] mx-auto flex flex-col items-center gap-10">
          {cursos.map((curso, i) => (
            <HomeCourseCard key={curso.id} curso={curso} index={i} />
          ))}
        </div>

        {/* Link alumnas */}
        <div className="text-center mt-12">
          <p className="font-cormorant text-2xl md:text-3xl text-glow-navy tracking-[0.1em] uppercase mb-4">
            ¿Ya sos alumna?
          </p>
          <Link
            href="/login"
            className="font-montserrat text-xs tracking-[0.25em] uppercase text-glow-navy border border-transparent px-6 py-3 inline-block hover:border-glow-navy transition-all duration-300"
          >
            Ingresar aquí →
          </Link>
        </div>
      </div>
    </section>
  )
}

function HomeCourseCard({ curso, index }: { curso: Curso; index: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-white"
      >
        {/* Imagen */}
        {curso.imagen_url && (
          <img
            src={curso.imagen_url}
            alt={curso.titulo}
            className="w-full h-auto block"
          />
        )}

        {/* Info */}
        <div className="bg-glow-navy px-6 pt-5 pb-6 flex flex-col gap-3">
          <h3
            className="font-cormorant text-white font-light tracking-wide uppercase leading-tight"
            style={{ fontSize: 'clamp(22px, 4vw, 30px)' }}
          >
            {curso.titulo}
          </h3>
          {curso.descripcion && (
            <p className="font-montserrat text-[11px] text-white/60 leading-relaxed line-clamp-2">
              {curso.descripcion}
            </p>
          )}
          <div className="flex items-end justify-between mt-1">
            <div className="flex flex-col gap-0.5">
              {curso.precio_oferta ? (
                <>
                  <span className="font-montserrat text-sm font-medium text-white">
                    {formatPrice(curso.precio_oferta)}
                  </span>
                  <span className="font-montserrat text-xs text-white/40 line-through">
                    {formatPrice(curso.precio)}
                  </span>
                </>
              ) : (
                <span className="font-montserrat text-sm font-medium text-white">
                  {formatPrice(curso.precio)}
                </span>
              )}
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="font-montserrat text-[10px] tracking-[0.2em] uppercase border border-white/60 text-white px-5 py-2 hover:bg-white hover:text-glow-navy transition-colors duration-300"
            >
              Más Info
            </button>
          </div>
        </div>
      </motion.div>

      <CourseInfoDrawer
        curso={curso}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}
