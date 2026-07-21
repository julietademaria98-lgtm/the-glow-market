'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const modulos = [
  {
    numero: '01',
    titulo: 'Preparación de Piel',
    subtitulo: 'Rutina esencial para un buen maquillaje',
    claim: 'No se trata de hacer más pasos. Se trata de hacer los correctos.',
  },
  {
    numero: '02',
    titulo: 'Base y Corrector',
    subtitulo: 'Piel uniforme, natural y bien trabajada',
    claim: 'Una buena piel no se tapa, se equilibra.',
  },
  {
    numero: '03',
    titulo: 'Makeup Express',
    subtitulo: 'Resolver el look diario con pocos productos',
    claim: 'Con solo 3 productos podés resolver tu maquillaje diario.',
  },
  {
    numero: '04',
    titulo: 'Transformación a Noche',
    subtitulo: 'Elevar el maquillaje sin empezar de cero',
    claim: 'No empezás de cero. Elevás lo que ya tenés.',
  },
]

export default function CourseModulesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })

  const cream = '#E9E2DA'
  const navy = '#192149'

  const bg = isInView ? navy : cream
  const text = isInView ? cream : navy
  const textMuted = isInView ? 'rgba(233,226,218,0.5)' : 'rgba(25,33,73,0.5)'
  const border = isInView ? 'rgba(233,226,218,0.3)' : navy

  return (
    <motion.section
      ref={ref}
      animate={{ backgroundColor: bg }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="w-full py-20 px-6 md:px-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <p
          className="font-montserrat text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ color: textMuted }}
        >
          Curso Online
        </p>
        <h2
          className="font-cormorant font-light"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: text }}
        >
          De Día a Noche
        </h2>
        <p
          className="font-cormorant italic mt-1"
          style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', color: textMuted }}
        >
          Método de Piel + Makeup Real
        </p>
        <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: textMuted }} />
      </motion.div>

      {/* Grid de módulos */}
      <div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2"
        style={{ border: `1px solid ${border}` }}
      >
        {modulos.map((modulo, i) => (
          <motion.div
            key={modulo.numero}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative p-8 md:p-10"
            style={{
              borderRight: i % 2 === 0 ? `1px solid ${border}` : 'none',
              borderBottom: i < 2 ? `1px solid ${border}` : 'none',
            }}
          >
            {/* Número decorativo — mismo color que el texto */}
            <span
              className="font-cormorant select-none absolute top-6 right-8"
              style={{ fontSize: 'clamp(60px, 8vw, 90px)', color: text, opacity: 0.25, lineHeight: 1 }}
            >
              {modulo.numero}
            </span>

            <div className="relative z-10">
              <p
                className="font-montserrat text-[9px] tracking-[0.3em] uppercase mb-2"
                style={{ color: textMuted }}
              >
                Módulo {modulo.numero}
              </p>
              <h3
                className="font-cormorant font-light mb-1"
                style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', color: text }}
              >
                {modulo.titulo}
              </h3>
              <p
                className="font-montserrat text-[10px] tracking-[0.2em] uppercase mb-6"
                style={{ color: textMuted }}
              >
                {modulo.subtitulo}
              </p>

              {/* Quote */}
              <div
                className="border-l-2 pl-4"
                style={{ borderColor: text }}
              >
                <p
                  className="font-cormorant italic"
                  style={{ fontSize: 'clamp(17px, 1.8vw, 22px)', color: text, opacity: 0.85, lineHeight: 1.5 }}
                >
                  "{modulo.claim}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex justify-center mt-12"
      >
        <Link
          href="/cursos"
          className="font-montserrat uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.25em',
            padding: '16px 48px',
            display: 'inline-block',
            backgroundColor: isInView ? cream : navy,
            color: isInView ? navy : cream,
            transition: 'opacity 0.3s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
        >
          Quiero el Curso
        </Link>
      </motion.div>
    </motion.section>
  )
}
