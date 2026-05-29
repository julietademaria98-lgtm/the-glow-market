'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Curso } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

interface Props {
  curso: Curso
  onClose: () => void
}

export default function CourseInfoDrawer({ curso, onClose }: Props) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleAddToCart = () => {
    addItem({
      id: curso.id,
      slug: curso.slug,
      nombre: curso.titulo,
      precio: curso.precio,
      imagen_url: curso.imagen_url || '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-glow-cream z-50 overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-glow-cream z-10 flex items-center justify-between px-8 py-5 border-b border-glow-navy/10">
          <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/50">
            Curso Online · En alianza con Clarins
          </span>
          <button
            onClick={onClose}
            className="text-glow-navy/40 hover:text-glow-navy transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-10 flex flex-col gap-14">

          {/* Hero */}
          <div>
            <h1 className="font-cormorant text-5xl md:text-6xl text-glow-navy font-light tracking-wide leading-none mb-4">
              {curso.titulo}
            </h1>
            <p className="font-cormorant text-xl text-glow-navy/70 italic mb-6">
              Pocos productos. Piel divina. Maquillaje que dura todo el día.
            </p>
            <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
              De cara recién levantada a look de noche, en 4 módulos cortos. Te enseño el método que uso todos los días para tener piel divina y un maquillaje que no se va.
            </p>
          </div>

          {/* Para quién es */}
          <div>
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 block mb-4">
              ¿Para quién es?
            </span>
            <h2 className="font-cormorant text-2xl text-glow-navy font-light mb-6">
              Si te sentís identificada con alguna de estas, este curso es para vos:
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                'Comprás productos de maquillaje y la mitad no los usás.',
                'Te cuesta hacerte la cara en menos de 30 minutos a la mañana.',
                'Querés llevar tu look del día a la noche sin desarmar todo.',
                'Tenés ganas de aprender un método simple que funcione siempre.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-glow-navy/30 mt-1">—</span>
                  <span className="font-montserrat text-sm text-glow-navy/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Módulos */}
          <div>
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 block mb-4">
              Contenido
            </span>
            <h2 className="font-cormorant text-2xl text-glow-navy font-light mb-2">
              Qué vas a aprender en cada módulo
            </h2>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-8">
              4 módulos cortos, pensados para que los puedas hacer en el orden que quieras y volver a verlos cuantas veces necesites.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { num: '01', titulo: 'Piel limpia e hidratada', duracion: '5-7 min', desc: 'La rutina de skincare que cambia el resultado del maquillaje en una sola sesión. Doble limpieza, tónico, sérum, hidratación y protección solar.' },
                { num: '02', titulo: 'Makeup básico de día', duracion: '7-9 min', desc: 'Tu look completo en pocos pasos. SOS Primer, Double Serum Foundation, corrector solo donde levanta, bronzer y un combo de labios que te llevás siempre.' },
                { num: '03', titulo: 'Retoque express', duracion: '3-4 min', desc: 'A las 4 de la tarde tu maquillaje no se va: solo necesita despertar. La mezcla mágica de aceite + base que te resucita la piel en menos de tres minutos.' },
                { num: '04', titulo: 'Transformación a noche', duracion: '6-8 min', desc: 'Mismo punto de partida que el de día, 5 pasos más y look completo de noche. Sombras, delineado, refuerzo de bronzer y labios potentes.' },
              ].map((mod) => (
                <div key={mod.num} className="border border-glow-navy/10 p-6 hover:border-glow-navy/20 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-montserrat text-[10px] tracking-[0.2em] text-glow-navy/30">{mod.num}</span>
                      <h3 className="font-cormorant text-lg text-glow-navy font-light">{mod.titulo}</h3>
                    </div>
                    <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-glow-navy/30 whitespace-nowrap">{mod.duracion}</span>
                  </div>
                  <p className="font-montserrat text-xs text-glow-navy/55 leading-relaxed pl-6">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Descargables */}
          <div>
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 block mb-4">
              Material adicional
            </span>
            <h2 className="font-cormorant text-2xl text-glow-navy font-light mb-2">
              5 descargables exclusivos
            </h2>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-6">
              Para que apliques sin volver al video. Son tuyos para siempre.
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Kit Esencial — lista completa de productos Clarins con qué hace cada uno.',
                'Diagnóstico de Piel — test de 6 preguntas para identificar tu tipo de piel.',
                'Guía de Subtono — 3 tests caseros para elegir la base correcta.',
                'SOS Primer por Color — los 5 colores y para qué sirve cada uno.',
                'Bronzer por Tipo de Cara — cómo aplicarlo según la forma de tu rostro.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-montserrat text-[10px] text-glow-navy/30 mt-0.5">✓</span>
                  <span className="font-montserrat text-xs text-glow-navy/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qué incluye */}
          <div>
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 block mb-4">
              Incluye
            </span>
            <h2 className="font-cormorant text-2xl text-glow-navy font-light mb-6">
              Lo que llevás al comprar el curso
            </h2>
            <div className="flex flex-col gap-3">
              {[
                '4 módulos en video, accesibles desde web y celular.',
                '5 descargables exclusivos en PDF.',
                'Acceso de por vida + todas las actualizaciones futuras.',
                'Links directos a cada producto Clarins con regalos exclusivos por compra.',
                'Acceso ilimitado para verlo cuantas veces necesités.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-montserrat text-[10px] text-glow-navy/30 mt-0.5">✓</span>
                  <span className="font-montserrat text-xs text-glow-navy/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 block mb-4">
              Preguntas frecuentes
            </span>
            <h2 className="font-cormorant text-2xl text-glow-navy font-light mb-6">
              Lo que más nos preguntan
            </h2>
            <div className="flex flex-col gap-0 border-t border-glow-navy/10">
              {[
                { q: '¿Cuánto dura el curso?', a: 'Los 4 módulos suman alrededor de 25 minutos de video. Está pensado para que lo puedas hacer en una mañana, o repartido en varios días.' },
                { q: '¿Cuándo lo puedo ver?', a: 'Apenas confirmás tu compra, te llega un mail con tu acceso. Podés empezar al minuto, desde la compu o el celular.' },
                { q: '¿Necesito comprar todos los productos?', a: 'No. El curso te sirve aunque uses productos que ya tenés. Te recomendamos Clarins porque son los que funcionan con este método, pero podés ir comprando de a uno.' },
                { q: '¿Tengo acceso para siempre?', a: 'Sí. Una vez que comprás el curso, lo tenés disponible para siempre, con todas las actualizaciones incluidas.' },
                { q: '¿Sirve si recién arranco con el maquillaje?', a: 'Sí. El curso está pensado para arrancar desde cero. El método es simple y progresivo.' },
              ].map((faq, i) => (
                <details key={i} className="group border-b border-glow-navy/10 py-4">
                  <summary className="font-montserrat text-xs tracking-wide text-glow-navy cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-glow-navy/30 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
                  </summary>
                  <p className="font-montserrat text-xs text-glow-navy/55 leading-relaxed mt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 bg-glow-cream border-t border-glow-navy/10 px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-montserrat text-xl font-medium text-glow-navy">
                {formatPrice(curso.precio)}
              </span>
              <p className="font-montserrat text-[10px] text-glow-navy/40 mt-0.5">
                Acceso de por vida · 5 descargables
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className={`font-montserrat text-[10px] tracking-[0.25em] uppercase px-8 py-3 transition-colors ${
                added
                  ? 'bg-green-700 text-white'
                  : 'bg-glow-navy text-white hover:bg-glow-navy/80'
              }`}
            >
              {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
