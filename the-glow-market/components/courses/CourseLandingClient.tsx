'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import AddToCartCurso from '@/components/courses/AddToCartCurso'
import PreviewVideo from '@/components/courses/PreviewVideo'
import SocialProofPopup from '@/components/courses/SocialProofPopup'
import StarIcon from '@/components/ui/StarIcon'
import type { Curso } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function CourseLandingClient({ curso }: { curso: Curso }) {
  return (
    <main className="min-h-screen bg-white">

      <SocialProofPopup cursoNombre={curso.titulo} />

      {/* Hero — Promesa */}
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
            className="font-cormorant text-4xl md:text-6xl text-glow-navy font-light tracking-wide leading-[1.1] mb-4"
          >
            Aprendé a maquillarte de manera profesional en menos de 30 minutos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-cormorant text-2xl text-glow-navy/60 italic mb-10"
          >
            Pocos productos. Piel divina. Maquillaje de día a noche en pocos pasos.
          </motion.p>

          {/* Video de bienvenida */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 mb-4 text-center">
              Mirá de qué se trata
            </p>
            <PreviewVideo cursoId={curso.id} />
          </motion.div>
        </div>
      </div>

      {/* Franja azul — propuesta + resumen */}
      <div className="bg-glow-navy py-16 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUp}
            className="font-cormorant text-2xl md:text-3xl text-white font-light leading-relaxed mb-6"
          >
            Te enseño el método que uso todos los días para tener piel divina y un maquillaje que no se va.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-white/50"
          >
            Acceso de por vida · 5 recursos bonus · Comunidad exclusiva · Links Clarins con regalos por compra
          </motion.p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* Cita — cierre de la Promesa */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-cormorant text-2xl md:text-3xl text-glow-navy/80 italic leading-relaxed text-center">
            "Este curso lo armé para vos, mujeres reales que quieren salir prolijas y se cansaron de probar productos que no usan."
          </p>
          <span className="block mt-4 text-center font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40">
            — Nina Amateis
          </span>
        </motion.section>

        {/* Dolores */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-2">
              ¿Este curso es para vos?
            </h2>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-6">
              Si te sentís identificada con alguna de estas, sí:
            </p>
          </motion.div>
          <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
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

        {/* Qué vas a lograr */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-2 uppercase">
              Qué vas a lograr en cada módulo
            </h2>
            <p className="font-montserrat text-sm text-glow-navy/50 mb-8">
              4 módulos cortos, pensados para un resultado concreto — volvé a verlos cuantas veces necesites.
            </p>
          </motion.div>
          <div className="space-y-6">
            {[
              {
                num: '01',
                titulo: 'Piel que se ve sana, no maquillada',
                resultado: 'Vas a lograr una piel luminosa, pareja e hidratada en minutos: la base perfecta para cualquier look.',
              },
              {
                num: '02',
                titulo: 'Un makeup de día que no se nota que te maquillaste',
                resultado: 'Vas a poder armar tu cara todos los días con pocos productos y en la mitad de tiempo que ahora.',
              },
              {
                num: '03',
                titulo: 'Un retoque que te salva a cualquier hora',
                resultado: 'Vas a saber exactamente qué tocar para verte fresca a las 4 de la tarde, sin rehacer todo de cero.',
              },
              {
                num: '04',
                titulo: 'Pasar de día a noche sin desarmar nada',
                resultado: 'Vas a transformar tu look de oficina en un look de noche en minutos, sumando solo un par de pasos.',
              },
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
                  <h3 className="font-montserrat text-sm font-medium tracking-wide text-glow-navy uppercase mb-2">
                    {mod.titulo}
                  </h3>
                  <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">{mod.resultado}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bonos */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-block w-10 h-px bg-glow-blush mb-4" />
            <h2 className="font-cormorant text-4xl text-glow-navy font-light uppercase tracking-wide">
              Comprando hoy, además te llevás
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { titulo: 'Guía de Compra Inteligente', desc: 'Sabés exactamente qué producto usar y para qué, así dejás de gastar en cosas que después no tocás.' },
              { titulo: 'El Método del Diagnóstico de Piel', desc: 'En 6 preguntas descubrís tu tipo de piel exacto y qué priorizar en cada paso, sin ensayo y error.' },
              { titulo: 'Guía del Subtono Perfecto', desc: 'Encontrás tu subtono real y elegís la base perfecta desde el día uno, sin devolver productos que no te quedan.' },
              { titulo: 'Guía SOS del Primer', desc: 'Sabés qué primer usar según cómo esté tu piel ese día, para que el maquillaje aguante sin importar el cansancio.' },
              { titulo: 'El Método del Contorno Perfecto', desc: 'Aplicás el bronzer exactamente donde tu cara lo necesita, con resultado de contorno profesional.' },
              { titulo: 'La Comunidad Glow', desc: 'Un espacio privado para mostrar tus looks, resolver dudas al instante y compartir con otras alumnas que están en el mismo camino que vos.' },
            ].map((d, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden bg-white border border-glow-navy/10 hover:border-glow-blush p-5 flex gap-4 items-start transition-colors duration-300 hover:shadow-lg"
              >
                <span className="pointer-events-none select-none absolute -top-2 -right-1 font-cormorant text-6xl text-glow-blush/10 group-hover:text-glow-blush/20 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative flex-shrink-0 w-9 h-9 rounded-full bg-glow-blush/15 group-hover:bg-glow-blush flex items-center justify-center transition-colors duration-300">
                  <Check size={15} className="text-glow-blush group-hover:text-white transition-colors duration-300" />
                </span>
                <div className="relative">
                  <p className="font-montserrat text-sm font-bold text-glow-navy mb-1">{d.titulo}</p>
                  <p className="font-montserrat text-xs text-glow-navy/60 leading-relaxed">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3 mt-10 pt-10 border-t border-glow-navy/10"
          >
            {[
              '4 módulos en video, accesibles desde web y celular.',
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

        {/* Bloque Clarins + Cupos + Valor, con olas propias (fuera del space-y del resto) */}
        <div>

        {/* Ola de entrada — blanco a navy */}
        <div className="-mt-4 -mb-px">
          <svg viewBox="0 0 1440 80" className="w-full h-14 md:h-20 block" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,24 C960,48 1200,80 1440,40 L1440,80 L0,80 Z" fill="#192149" />
          </svg>
        </div>

        {/* Sponsored by Clarins */}
        <section className="relative overflow-hidden bg-glow-navy -mx-6 px-6 pb-16 text-center">
          <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 w-64 h-64 rounded-full bg-glow-blush/20 blur-3xl" />
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-montserrat text-[10px] tracking-[0.35em] uppercase text-glow-blush mb-4">
              Con el respaldo de
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <StarIcon size={12} className="text-glow-blush" />
              <p className="font-cormorant text-5xl md:text-6xl text-white font-light tracking-[0.2em]">
                CLARINS
              </p>
              <StarIcon size={12} className="text-glow-blush" />
            </div>
            <div className="w-16 h-px bg-glow-blush mx-auto mb-6" />
            <p className="font-montserrat text-sm text-white/70 max-w-md mx-auto leading-relaxed">
              Este curso está armado con productos y el respaldo de <strong className="text-white font-semibold">Clarins</strong>, marca líder mundial en cuidado de la piel. Aprendés un método pensado para funcionar con productos de calidad probada.
            </p>
          </motion.div>
        </section>

        {/* Ola — navy a rosa */}
        <div className="-mb-px">
          <svg viewBox="0 0 1440 80" className="w-full h-10 md:h-14 block" preserveAspectRatio="none">
            <path d="M0,20 C240,50 480,60 720,35 C960,10 1200,45 1440,25 L1440,80 L0,80 Z" fill="#E1C8CB" />
          </svg>
        </div>

        {/* Urgencia — cupos */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-glow-blush -mx-6 px-6 pb-16 text-center"
        >
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 bg-white text-glow-blush font-montserrat text-[10px] tracking-[0.2em] uppercase px-4 py-2 mb-5 font-bold shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-glow-blush animate-pulse" />
            Cupos limitados
          </motion.span>
          <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light mb-3 drop-shadow-sm">
            Abrimos solo <span className="underline decoration-white/40 decoration-2 underline-offset-4">30 cupos</span>
          </h2>
          <p className="font-montserrat text-sm text-white leading-relaxed max-w-md mx-auto">
            Abrimos 30 cupos a precio de lanzamiento para esta primera camada. <strong className="font-bold">Cuando se completen, el curso pasa a su precio regular.</strong>
          </p>
        </motion.section>

        {/* Ola de salida — rosa a blanco */}
        <div className="-mt-px">
          <svg viewBox="0 0 1440 80" className="w-full h-10 md:h-14 block" preserveAspectRatio="none">
            <path d="M0,60 C240,20 480,10 720,45 C960,80 1200,30 1440,55 L1440,0 L0,0 Z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Valor — compra */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block bg-glow-navy text-white font-montserrat text-[10px] tracking-[0.2em] uppercase px-4 py-2 mb-4 font-bold">
            Precio de lanzamiento
          </span>
          <div className="flex items-center justify-center gap-3 mb-2">
            <StarIcon size={9} className="text-glow-blush" />
            <h3 className="font-cormorant text-3xl text-glow-navy font-light">
              Accedé <span className="font-semibold text-glow-blush">hoy</span>
            </h3>
            <StarIcon size={9} className="text-glow-blush" />
          </div>
          <p className="font-montserrat text-sm text-glow-navy/70 mb-8 max-w-xs mx-auto">
            Todo el curso, los bonos y la comunidad, <strong className="text-glow-navy">antes de que suba el precio</strong>.
          </p>
          <AddToCartCurso curso={curso} />
        </motion.section>

        </div>

        {/* FAQ — al final de todo */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-cormorant text-3xl text-glow-navy font-light mb-6">
            Lo que más nos preguntan
          </motion.h2>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-1">
            {[
              { q: '¿Cuánto dura el curso?', a: 'Los 4 módulos suman alrededor de 25 minutos de video. Está pensado para que lo puedas hacer en una mañana o repartido en varios días.' },
              { q: '¿Cuándo lo puedo ver?', a: 'Apenas confirmás tu compra, te llega un mail con tu acceso. Podés empezar al minuto, desde la compu o el celular.' },
              { q: '¿Necesito crear una cuenta antes de comprar?', a: 'No. Comprás primero y creás tu cuenta gratis después, con el mismo email que usaste en la compra. En cuanto inicies sesión, el curso se activa solo.' },
              { q: '¿Necesito comprar todos los productos Clarins?', a: 'No. El curso te sirve aunque uses productos que ya tenés. Recomendamos Clarins porque son los que funcionan con este método, y las alumnas tienen un beneficio exclusivo.' },
              { q: '¿Tengo acceso para siempre?', a: 'Sí. Una vez que comprás el curso, lo tenés disponible para siempre, con todas las actualizaciones que vayamos sumando.' },
            ].map((item, i) => (
              <motion.details key={i} variants={fadeUp} className="group border-b border-glow-navy/10 last:border-0">
                <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
                  <span className="font-montserrat text-sm font-medium text-glow-navy pr-4">{item.q}</span>
                  <span className="text-glow-navy/40 group-open:rotate-45 transition-transform duration-200 flex-shrink-0 text-xl leading-none">+</span>
                </summary>
                <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed pb-4">{item.a}</p>
              </motion.details>
            ))}
          </motion.div>
          <Link href="/" className="block mt-10 text-center font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy transition-colors">
            ← Volver al inicio
          </Link>
        </section>

      </div>
    </main>
  )
}
