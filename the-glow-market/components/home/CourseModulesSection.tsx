'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const modulos = [
  {
    numero: '01',
    titulo: 'Preparación de Piel',
    subtitulo: 'Rutina esencial para un buen maquillaje',
    descripcion: 'Doble limpieza, hidratación y preparación de labios. La base de todo buen makeup.',
    claim: 'No se trata de hacer más pasos. Se trata de hacer los correctos.',
  },
  {
    numero: '02',
    titulo: 'Base y Corrector',
    subtitulo: 'Piel uniforme, natural y bien trabajada',
    descripcion: 'Cómo elegir el tono correcto, técnicas de aplicación y el uso estratégico del corrector.',
    claim: 'Una buena piel no se tapa, se equilibra.',
  },
  {
    numero: '03',
    titulo: 'Makeup Express',
    subtitulo: 'Resolver el look diario con pocos productos',
    descripcion: 'Bronzer, máscara de pestañas y labial. Un maquillaje completo en minutos.',
    claim: 'Con solo 3 productos podés resolver tu maquillaje diario.',
  },
  {
    numero: '04',
    titulo: 'Transformación a Noche',
    subtitulo: 'Elevar el maquillaje sin empezar de cero',
    descripcion: 'Intensificación de ojos, delineado, labios protagonistas e iluminación estratégica.',
    claim: 'No empezás de cero. Elevás lo que ya tenés.',
  },
]

export default function CourseModulesSection() {
  return (
    <section className="bg-glow-cream py-20 px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-montserrat text-xs tracking-[0.3em] uppercase text-glow-navy/50 mb-4">
            Curso Online
          </p>
          <h2 className="font-cormorant text-glow-navy font-light mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
            De Día a Noche
          </h2>
          <p className="font-montserrat text-glow-navy/60 text-xs tracking-[0.2em] uppercase">
            Método de Piel + Makeup Real
          </p>
          <div className="w-16 h-px bg-glow-navy/30 mx-auto mt-8" />
        </motion.div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: '#192149' }}>
          {modulos.map((modulo, i) => (
            <motion.div
              key={modulo.numero}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-glow-cream p-10 flex flex-col gap-4"
            >
              <span className="font-cormorant text-glow-navy/20 font-light"
                style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 1 }}>
                {modulo.numero}
              </span>
              <div>
                <h3 className="font-cormorant text-glow-navy font-light mb-1"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}>
                  {modulo.titulo}
                </h3>
                <p className="font-montserrat text-glow-navy/60 uppercase tracking-[0.15em]"
                  style={{ fontSize: '10px' }}>
                  {modulo.subtitulo}
                </p>
              </div>
              <p className="font-montserrat text-glow-navy/70 leading-relaxed"
                style={{ fontSize: '12px' }}>
                {modulo.descripcion}
              </p>
              <p className="font-cormorant italic text-glow-navy/50"
                style={{ fontSize: '15px' }}>
                "{modulo.claim}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-14"
        >
          <Link
            href="/cursos"
            className="font-montserrat uppercase inline-block"
            style={{
              fontSize: '11px',
              letterSpacing: '0.25em',
              padding: '16px 48px',
              backgroundColor: '#192149',
              color: '#ffffff',
              borderRadius: '0',
            }}
          >
            Quiero el Curso
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
