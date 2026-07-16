'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'
import AddToCartCurso from '@/components/courses/AddToCartCurso'
import type { Curso } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = target / (1200 / 16)
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function CourseLandingClient({ curso }: { curso: Curso }) {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-glow-cream pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 mb-4"
          >
            Curso Online · Sponsored by Clarins
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-cormorant text-5xl md:text-7xl text-glow-navy font-light tracking-wide leading-none mb-4"
          >
            Curso de Maquillaje: {curso.titulo}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-cormorant text-2xl text-glow-navy/60 italic mb-6"
          >
            Pocos productos. Piel divina. Maquillaje que dura todo el día.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-montserrat text-sm text-glow-navy/60 leading-relaxed max-w-xl mb-8"
          >
            De cara recién levantada a look de noche, en 4 módulos cortos. Te enseño el método que uso todos los días para tener piel divina y un maquillaje que no se va.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40"
          >
            Acceso de por vida · 5 descargables · Links Clarins con regalos por compra
          </motion.p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-glow-navy py-12 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: 4, suffix: '', label: 'Módulos' },
            { value: 5, suffix: '', label: 'Descargables PDF' },
            { value: 25, suffix: ' min', label: 'De video total' },
            { value: 100, suffix: '%', label: 'Online y a tu ritmo' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <p className="font-cormorant text-5xl text-glow-blush font-light mb-1">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-white/50">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* Qué es */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-4">
            Qué es Day to Night Glow
          </h2>
          <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
            Un curso de automaquillaje en 4 módulos cortos, pensado para vos que querés salir prolija sin gastar 30 minutos cada mañana. Aprendés una rutina de piel que cambia todo, un maquillaje de día completo con pocos productos, un retoque express que te salva a las 4 de la tarde, y una transformación a noche que no te obliga a desarmar nada. Con productos buenos, buena técnica, y todo el respaldo de Clarins.
          </p>
        </motion.section>

        {/* Para quién */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-2">
              ¿Este curso es para vos?
            </h2>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-6">
              Si te sentís identificada con alguna de estas, sí:
            </p>
          </motion.div>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              'Comprás productos de maquillaje y la mitad no los usás.',
              'Te cuesta hacerte la cara en menos de 30 minutos a la mañana.',
              'Querés llevar tu look del día a la noche sin desarmar todo.',
              'Tenés ganas de aprender un método simple que funcione siempre.',
            ].map((item, i) => (
              <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-glow-blush flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" />
                </span>
                <span className="font-montserrat text-sm text-glow-navy/70">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* Módulos */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-2 uppercase">
              Qué vas a aprender en cada módulo
            </h2>
            <p className="font-montserrat text-sm text-glow-navy/50 mb-8">
              4 módulos cortos — volvé a verlos cuantas veces necesites.
            </p>
          </motion.div>
          <div className="space-y-6">
            {[
              { num: '01', titulo: 'Piel limpia e hidratada', duracion: '5–7 min' },
              { num: '02', titulo: 'Makeup básico de día', duracion: '7–9 min' },
              { num: '03', titulo: 'Retoque', duracion: '3–4 min' },
              { num: '04', titulo: 'Transformación a noche', duracion: '6–8 min' },
            ].map((mod, i) => (
              <motion.div
                key={mod.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-6 items-start border-b border-glow-navy/10 pb-6 last:border-0"
              >
                <span className="font-cormorant text-5xl text-glow-blush font-light leading-none flex-shrink-0 w-12">
                  {mod.num}
                </span>
                <div className="pt-2">
                  <h3 className="font-montserrat text-sm font-medium tracking-wide text-glow-navy uppercase mb-1">
                    {mod.titulo}
                  </h3>
                  <span className="font-montserrat text-[10px] text-glow-navy/40">{mod.duracion}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Descargables */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-2">
              5 descargables exclusivos
            </h2>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-8">
              Material adicional para que apliques sin volver al video — para siempre.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { titulo: 'Kit Esencial', desc: 'Lista completa de productos Clarins con qué hace cada uno y en qué módulos aparece.' },
              { titulo: 'Diagnóstico de Piel', desc: 'Test de 6 preguntas para identificar tu tipo de piel y saber qué priorizar en cada módulo.' },
              { titulo: 'Guía de Subtono', desc: '3 tests caseros para identificar tu subtono y elegir la base correcta sin perder plata.' },
              { titulo: 'SOS Primer por Color', desc: 'Los 5 colores del SOS Primer Clarins y para qué sirve cada uno.' },
              { titulo: 'Bronzer por Tipo de Cara', desc: 'Diagramas visuales del paso a paso según tu forma de rostro (6 tipos).' },
            ].map((d, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="flex gap-4 items-start p-4 border border-glow-navy/10 hover:border-glow-blush/50 hover:shadow-sm transition-shadow duration-300"
              >
                <span className="font-montserrat text-[10px] tracking-widest text-glow-blush flex-shrink-0 mt-0.5">PDF</span>
                <div>
                  <p className="font-montserrat text-xs font-medium text-glow-navy mb-0.5">{d.titulo}</p>
                  <p className="font-montserrat text-[11px] text-glow-navy/50 leading-relaxed">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Lo que incluye */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-cormorant text-3xl text-glow-navy font-light mb-6"
          >
            Lo que llevás al comprar el curso
          </motion.h2>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {[
              '4 módulos en video, accesibles desde web y celular.',
              '5 descargables exclusivos en PDF.',
              'Acceso de por vida + todas las actualizaciones futuras.',
              'Links directos a cada producto Clarins con regalos exclusivos por compra.',
              'Acceso ilimitado para verlo cuantas veces necesites.',
            ].map((item, i) => (
              <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                <Check size={14} className="text-glow-navy mt-0.5 flex-shrink-0" />
                <span className="font-montserrat text-sm text-glow-navy/70">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* FAQ */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-cormorant text-3xl text-glow-navy font-light mb-6"
          >
            Lo que más nos preguntan
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-1"
          >
            {[
              { q: '¿Cuánto dura el curso?', a: 'Los 4 módulos suman alrededor de 25 minutos de video. Está pensado para que lo puedas hacer en una mañana o repartido en varios días.' },
              { q: '¿Cuándo lo puedo ver?', a: 'Apenas confirmás tu compra, te llega un mail con tu acceso. Podés empezar al minuto, desde la compu o el celular.' },
              { q: '¿Necesito comprar todos los productos Clarins?', a: 'No. El curso te sirve aunque uses productos que ya tenés. Recomendamos Clarins porque son los que funcionan con este método, y las alumnas tienen un beneficio exclusivo.' },
              { q: '¿Tengo acceso para siempre?', a: 'Sí. Una vez que comprás el curso, lo tenés disponible para siempre, con todas las actualizaciones que vayamos sumando.' },
            ].map((item, i) => (
              <motion.details
                key={i}
                variants={fadeUp}
                className="group border-b border-glow-navy/10 last:border-0"
              >
                <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
                  <span className="font-montserrat text-sm font-medium text-glow-navy pr-4">{item.q}</span>
                  <span className="text-glow-navy/40 group-open:rotate-45 transition-transform duration-200 flex-shrink-0 text-xl leading-none">+</span>
                </summary>
                <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed pb-4">{item.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </section>

        {/* CTA final */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-glow-navy/10 pt-16 text-center"
        >
          <h2 className="font-cormorant text-4xl text-glow-navy font-light mb-4">
            ¿Lista para empezar?
          </h2>
          <p className="font-montserrat text-sm text-glow-navy/60 mb-10">
            Acceso inmediato. De por vida. Desde cualquier dispositivo.
          </p>
          <AddToCartCurso curso={curso} />
          <Link href="/cursos" className="block mt-6 font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy transition-colors">
            ← Volver a cursos
          </Link>
        </motion.section>

      </div>
    </main>
  )
}
