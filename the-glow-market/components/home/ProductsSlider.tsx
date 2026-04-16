'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Producto } from '@/types'
import StarIcon from '@/components/ui/StarIcon'

interface ProductsSliderProps {
  productos: Producto[]
}

export default function ProductsSlider({ productos }: ProductsSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Desplazamiento horizontal proporcional al número de productos
  const xPercent = -60 * Math.max(0, productos.length - 2)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `${xPercent}%`])

  return (
    <section className="bg-glow-cream py-20">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3">
            <StarIcon size={10} className="text-glow-navy" />
            <span className="section-subtitle">Nueva Colección</span>
            <StarIcon size={10} className="text-glow-navy" />
          </div>
          <h2 className="section-title">Piezas Destacadas</h2>
        </motion.div>
      </div>

      {/* Horizontal scroll container — solo en desktop */}
      <div
        ref={containerRef}
        className="hidden lg:block relative"
        style={{ height: `${Math.max(300, productos.length * 50)}vh` }}
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex gap-6 pl-[10vw]"
          >
            {productos.map((producto, i) => (
              <SliderCard key={producto.id} producto={producto} index={i} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile grid */}
      <div className="lg:hidden max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 gap-4">
          {productos.map((producto, i) => (
            <MobileProductCard key={producto.id} producto={producto} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SliderCard({ producto, index }: { producto: Producto; index: number }) {
  const mainImage =
    producto.imagenes?.find((img) => img.es_principal)?.url ||
    producto.imagenes?.[0]?.url ||
    '/placeholder-product.jpg'

  const hoverImage = producto.imagenes?.find((img) => !img.es_principal)?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-[280px] group"
    >
      <Link href={`/productos/${producto.slug}`}>
        {/* Image */}
        <div className="relative w-[280px] h-[373px] overflow-hidden bg-white">
          <Image
            src={mainImage}
            alt={producto.nombre}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            sizes="280px"
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={producto.nombre}
              fill
              className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="280px"
            />
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-glow-navy/0 group-hover:bg-glow-navy/10 transition-colors duration-500 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
              <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-white bg-glow-navy px-4 py-2">
                Ver más
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-1">
          <h3 className="font-cormorant text-xl text-glow-navy tracking-wide">
            {producto.nombre}
          </h3>
          <div className="flex items-baseline gap-2">
            {producto.precio_oferta ? (
              <>
                <span className="font-montserrat text-sm font-medium text-glow-navy">
                  {formatPrice(producto.precio_oferta)}
                </span>
                <span className="font-montserrat text-xs text-glow-navy/40 line-through">
                  {formatPrice(producto.precio)}
                </span>
              </>
            ) : (
              <span className="font-montserrat text-sm font-medium text-glow-navy">
                {formatPrice(producto.precio)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function MobileProductCard({ producto, index }: { producto: Producto; index: number }) {
  const mainImage =
    producto.imagenes?.find((img) => img.es_principal)?.url ||
    producto.imagenes?.[0]?.url ||
    '/placeholder-product.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/productos/${producto.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-white mb-3">
          <Image
            src={mainImage}
            alt={producto.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw"
          />
        </div>
        <h3 className="font-cormorant text-base text-glow-navy">{producto.nombre}</h3>
        <p className="font-montserrat text-xs font-medium text-glow-navy mt-0.5">
          {formatPrice(producto.precio_oferta ?? producto.precio)}
        </p>
      </Link>
    </motion.div>
  )
}
