'use client'

import { useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Curso } from '@/types'
import { useState } from 'react'

interface CourseInfoDrawerProps {
  curso: Curso
  isOpen: boolean
  onClose: () => void
}

export default function CourseInfoDrawer({ curso, isOpen, onClose }: CourseInfoDrawerProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleAddToCart = () => {
    addItem({
      id: curso.id,
      slug: curso.slug,
      nombre: curso.titulo,
      precio: Number(curso.precio_oferta ?? curso.precio),
      imagen_url: curso.imagen_url || '',
      tipo: 'curso',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-glow-navy/10 flex-shrink-0">
          <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-glow-navy/40">
            Curso Online · En alianza con Clarins
          </span>
          <button
            onClick={onClose}
            className="text-glow-navy/40 hover:text-glow-navy transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-36">

          {/* Hero */}
          <div className="px-6 pt-8 pb-6 bg-glow-cream/40">
            <h2 className="font-cormorant text-4xl text-glow-navy font-light tracking-wide leading-tight mb-2">
              {curso.titulo}
            </h2>
            <p className="font-cormorant text-xl text-glow-navy/70 italic mb-4">
              Pocos productos. Piel divina. Maquillaje que dura todo el día.
            </p>
            <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
              De cara recién levantada a look de noche, en 4 módulos cortos. Te enseño el método que uso todos los días para tener piel divina y un maquillaje que no se va.
            </p>
            <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/40 mt-4">
              Acceso de por vida · 5 descargables · Links Clarins con regalos por compra
            </p>
          </div>

          {/* La promesa */}
          <div className="px-6 py-6 border-b border-glow-navy/10">
            <h3 className="font-cormorant text-2xl text-glow-navy font-light mb-3">
              Qué es Day to Night Glow
            </h3>
            <p className="font-montserrat text-sm text-glow-navy/60 leading-relaxed">
              Un curso de automaquillaje en 4 módulos cortos, pensado para vos que querés salir prolija sin gastar 30 minutos cada mañana. Aprendés una rutina de piel que cambia todo, un maquillaje de día completo con pocos productos, un retoque express que te salva a las 4 de la tarde, y una transformación a noche que no te obliga a desarmar nada. Con productos buenos, buena técnica, y todo el respaldo de Clarins.
            </p>
          </div>

          {/* Para quién es */}
          <div className="px-6 py-6 border-b border-glow-navy/10">
            <h3 className="font-cormorant text-2xl text-glow-navy font-light mb-1">
              ¿Este curso es para vos?
            </h3>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-4">
              Si te sentís identificada con alguna de estas, sí:
            </p>
            <ul className="space-y-3">
              {[
                'Comprás productos de maquillaje y la mitad no los usás.',
                'Te cuesta hacerte la cara en menos de 30 minutos a la mañana.',
                'Querés llevar tu look del día a la noche sin desarmar todo.',
                'Tenés ganas de aprender un método simple que funcione siempre.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-glow-blush/20 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-glow-navy" />
                  </span>
                  <span className="font-montserrat text-sm text-glow-navy/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Los 4 módulos */}
          <div className="px-6 py-6 border-b border-glow-navy/10">
            <h3 className="font-cormorant text-2xl text-glow-navy font-light mb-1 uppercase">
              Qué vas a aprender en cada módulo
            </h3>
            <p className="font-montserrat text-sm text-glow-navy/50 mb-5">
              4 módulos cortos — volvé a verlos cuantas veces necesites.
            </p>
            <div className="space-y-4">
              {[
                {
                  num: '01',
                  titulo: 'Piel limpia e hidratada',
                  duracion: '5–7 min',
                },
                {
                  num: '02',
                  titulo: 'Makeup básico de día',
                  duracion: '7–9 min',
                },
                {
                  num: '03',
                  titulo: 'Retoque',
                  duracion: '3–4 min',
                },
                {
                  num: '04',
                  titulo: 'Transformación a noche',
                  duracion: '6–8 min',
                },
              ].map((mod) => (
                <div key={mod.num} className="flex gap-4">
                  <span className="font-cormorant text-3xl text-glow-blush/50 font-light leading-none flex-shrink-0">
                    {mod.num}
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h4 className="font-montserrat text-xs font-medium tracking-wide text-glow-navy uppercase">
                        {mod.titulo}
                      </h4>
                      <span className="font-montserrat text-[10px] text-glow-navy/40">· {mod.duracion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 descargables */}
          <div className="px-6 py-6 border-b border-glow-navy/10">
            <h3 className="font-cormorant text-2xl text-glow-navy font-light mb-1">
              5 descargables exclusivos
            </h3>
            <p className="font-montserrat text-xs text-glow-navy/50 mb-5">
              Material adicional para que apliques sin volver al video — para siempre.
            </p>
            <div className="space-y-3">
              {[
                { titulo: 'Kit Esencial', desc: 'Lista completa de productos Clarins con qué hace cada uno y en qué módulos aparece.' },
                { titulo: 'Diagnóstico de Piel', desc: 'Test de 6 preguntas para identificar tu tipo de piel y saber qué priorizar en cada módulo.' },
                { titulo: 'Guía de Subtono', desc: '3 tests caseros para identificar tu subtono y elegir la base correcta sin perder plata.' },
                { titulo: 'SOS Primer por Color', desc: 'Los 5 colores del SOS Primer Clarins y para qué sirve cada uno.' },
                { titulo: 'Bronzer por Tipo de Cara', desc: 'Diagramas visuales del paso a paso según tu forma de rostro (6 tipos).' },
              ].map((d, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="font-montserrat text-[10px] tracking-widest text-glow-blush flex-shrink-0 mt-0.5">PDF</span>
                  <div>
                    <p className="font-montserrat text-xs font-medium text-glow-navy">{d.titulo}</p>
                    <p className="font-montserrat text-[11px] text-glow-navy/50 leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qué incluye */}
          <div className="px-6 py-6 border-b border-glow-navy/10">
            <h3 className="font-cormorant text-2xl text-glow-navy font-light mb-4">
              Lo que llevás al comprar el curso
            </h3>
            <ul className="space-y-2">
              {[
                '4 módulos en video, accesibles desde web y celular.',
                '5 descargables exclusivos en PDF.',
                'Acceso de por vida + todas las actualizaciones futuras.',
                'Links directos a cada producto Clarins con regalos exclusivos por compra.',
                'Acceso ilimitado para verlo cuantas veces necesites.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={13} className="text-glow-navy mt-0.5 flex-shrink-0" />
                  <span className="font-montserrat text-sm text-glow-navy/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="px-6 py-6">
            <h3 className="font-cormorant text-2xl text-glow-navy font-light mb-4">
              Lo que más nos preguntan
            </h3>
            <div className="space-y-2">
              {[
                {
                  q: '¿Cuánto dura el curso?',
                  a: 'Los 4 módulos suman alrededor de 25 minutos de video. Está pensado para que lo puedas hacer en una mañana o repartido en varios días. Lo importante no es la duración, es la cantidad de veces que vas a volver a verlo.',
                },
                {
                  q: '¿Cuándo lo puedo ver?',
                  a: 'Apenas confirmás tu compra, te llega un mail con tu acceso. Podés empezar al minuto, desde la compu o el celular.',
                },
                {
                  q: '¿Necesito comprar todos los productos Clarins?',
                  a: 'No. El curso te sirve aunque uses productos que ya tenés. Recomendamos Clarins porque son los que funcionan con este método, y las alumnas tienen un beneficio exclusivo. Podés ir comprando de a uno, según tu prioridad.',
                },
                {
                  q: '¿Tengo acceso para siempre?',
                  a: 'Sí. Una vez que comprás el curso, lo tenés disponible para siempre, con todas las actualizaciones que vayamos sumando.',
                },
              ].map((item, i) => (
                <details key={i} className="group border-b border-glow-navy/10 last:border-0">
                  <summary className="flex justify-between items-center py-3 cursor-pointer list-none">
                    <span className="font-montserrat text-xs font-medium text-glow-navy pr-4">{item.q}</span>
                    <span className="text-glow-navy/40 group-open:rotate-45 transition-transform duration-200 flex-shrink-0 text-lg leading-none">+</span>
                  </summary>
                  <p className="font-montserrat text-xs text-glow-navy/60 leading-relaxed pb-4">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-glow-navy/10 px-6 py-4 flex items-center justify-between gap-4">
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
            <span className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-glow-navy/40">
              Precio de lanzamiento
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex-1 max-w-[220px] py-3.5 font-montserrat text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              added
                ? 'bg-glow-royal text-white'
                : 'bg-glow-navy text-white hover:bg-glow-blue'
            }`}
          >
            {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>

      </div>
    </>
  )
}
