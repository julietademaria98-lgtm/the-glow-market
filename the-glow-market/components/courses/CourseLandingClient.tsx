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
            Acceso de por vida · 5 descargables · Comunidad exclusiva · Links Clarins con regalos por compra
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
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-2">
              Todo lo que te llevás
            </h2>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-8">
              Más allá de los videos, esto es lo que te ayuda a aplicar el método para siempre.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            {[
              { titulo: 'Kit Esencial', desc: 'Sabés exactamente qué producto Clarins usar y para qué, sin comprar de más ni adivinar.' },
              { titulo: 'Diagnóstico de Piel', desc: 'Identificás tu tipo de piel en 6 preguntas y sabés qué priorizar en cada módulo.' },
              { titulo: 'Guía de Subtono', desc: 'Elegís la base correcta a la primera, sin gastar plata en productos que no te sirven.' },
              { titulo: 'SOS Primer por Color', desc: 'Sabés qué primer usar según lo que tu piel necesita ese día.' },
              { titulo: 'Bronzer por Tipo de Cara', desc: 'Aplicás el bronzer en el lugar justo para tu forma de cara, con diagramas paso a paso.' },
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

            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              className="flex gap-4 items-start p-4 border border-glow-blush/40 bg-glow-cream/40 hover:border-glow-blush hover:shadow-sm transition-shadow duration-300"
            >
              <span className="font-montserrat text-[10px] tracking-widest text-glow-blush flex-shrink-0 mt-0.5">BONUS</span>
              <div>
                <p className="font-montserrat text-xs font-medium text-glow-navy mb-0.5">Comunidad Glow</p>
                <p className="font-montserrat text-[11px] text-glow-navy/50 leading-relaxed">
                  Un espacio privado para compartir dudas, mostrar tus looks y hablar con otras alumnas que están aprendiendo lo mismo que vos.
                </p>
              </div>
            </motion.div>
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

        {/* Casos reales */}
        <section className="border-t border-glow-navy/10 pt-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-2">
              A ellas ya les funcionó
            </h2>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-8">
              Alumnas reales de Day to Night Glow contando qué cambió después del curso.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                nombre: 'Sofía R.',
                resultado: 'Antes tardaba 40 minutos en maquillarme y terminaba retocando todo el día. Ahora en 15 minutos tengo un look que me dura hasta la noche.',
              },
              {
                nombre: 'Valentina M.',
                resultado: 'Tenía como 10 productos tirados en un cajón sin saber para qué servían. Después del curso entendí cuáles usar y dejé de gastar en cosas que no necesitaba.',
              },
              {
                nombre: 'Camila G.',
                resultado: 'Lo que más me sirvió fue el módulo de transformación a noche. Salgo de la oficina y en 5 minutos estoy lista para salir.',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-glow-cream/50 p-6 flex flex-col gap-3"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} size={10} className="text-glow-blush" />
                  ))}
                </div>
                <p className="font-cormorant text-lg text-glow-navy/80 italic leading-relaxed">
                  "{t.resultado}"
                </p>
                <span className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 mt-auto">
                  {t.nombre}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Valor + Urgencia */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-glow-navy/10 pt-16"
        >
          <div className="bg-glow-cream -mx-6 px-6 py-14 md:py-16 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 text-center">
            <div className="flex-1 flex flex-col items-center max-w-xs">
              <span className="inline-block bg-glow-blush text-white font-montserrat text-[9px] tracking-[0.2em] uppercase px-4 py-2 mb-4">
                Cupos limitados
              </span>
              <h2 className="font-cormorant text-3xl text-glow-navy font-light mb-3">
                Solo quedan 50 cupos
              </h2>
              <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
                Abrimos 50 cupos a precio de lanzamiento para esta primera camada. Cuando se completen, el curso pasa a su precio regular.
              </p>
            </div>

            <div className="hidden md:block w-px h-36 bg-glow-navy/10" />
            <div className="md:hidden w-24 h-px bg-glow-navy/10" />

            <div className="flex-1 flex flex-col items-center">
              <h3 className="font-cormorant text-2xl text-glow-navy font-light mb-1">
                Accedé hoy
              </h3>
              <p className="font-montserrat text-xs text-glow-navy/50 mb-6 max-w-xs">
                Todo el curso, los descargables y la comunidad, a precio de lanzamiento.
              </p>
              <AddToCartCurso curso={curso} />
            </div>
          </div>
        </motion.section>

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
          <Link href="/cursos" className="block mt-10 text-center font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy transition-colors">
            ← Volver a cursos
          </Link>
        </section>

      </div>
    </main>
  )
}
