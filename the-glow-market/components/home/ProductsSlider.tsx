'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Producto } from '@/types'
import { useCartStore } from '@/store/cartStore'
import StarIcon from '@/components/ui/StarIcon'

interface ProductsSliderProps {
  productos: Producto[]
}

export default function ProductsSlider({ productos }: ProductsSliderProps) {
  return (
    <section className="bg-glow-cream">
      <div className="max-w-[1400px] mx-auto px-6 py-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4"
        >
          <StarIcon size={12} className="text-glow-navy" />
          <span
            className="font-montserrat uppercase text-glow-navy tracking-[0.2em]"
            style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}
          >
            THE FLOWER POUCH CAPSULE
          </span>
          <StarIcon size={12} className="text-glow-navy" />
        </motion.div>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ backgroundColor: '#192149', gap: '1px' }}
      >
        {productos.map((producto, i) => (
          <MejuriCard key={producto.id} producto={producto} index={i} />
        ))}
      </div>
    </section>
  )
}

function MejuriCard({ producto, index }: { producto: Producto; index: number }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const mainImage =
    producto.imagenes?.find((img) => img.es_principal)?.url ||
    producto.imagenes?.[0]?.url

  const precioOriginal = Number(producto.precio)
  const precioOferta = producto.precio_oferta ? Number(producto.precio_oferta) : null
  const descuento = precioOferta
    ? Math.round((1 - precioOferta / precioOriginal) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      precio: precioOferta ?? precioOriginal,
      imagen_url: mainImage || '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group bg-white cursor-pointer overflow-hidden relative"
    >
      <Link href={`/productos/${producto.slug}`} className="block">
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '1/1',
            backgroundColor: mainImage ? '#F5F5F3' : '#E9E2DA',
          }}
        >
          {mainImage && (
            <Image
              src={mainImage}
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
            <button
              onClick={handleAddToCart}
              className="w-full font-montserrat uppercase text-center"
              style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                padding: '14px',
                backgroundColor: added ? '#192149' : 'rgba(255,255,255,0.95)',
                color: added ? '#ffffff' : '#192149',
                transition: 'background-color 0.2s, color 0.2s',
              }}
            >
              {added ? '✓ Agregado' : 'Agregar al carrito'}
            </button>
          </div>
        </div>

        <div className="px-4 pt-4 pb-5">
          <p
            className="font-montserrat uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: '#192149',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {producto.nombre}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {precioOferta ? (
              <>
                <span className="font-montserrat" style={{ fontSize: '13px', color: '#192149' }}>
                  {formatPrice(precioOferta)}
                </span>
                <span className="font-montserrat line-through" style={{ fontSize: '11px', color: '#999999' }}>
                  {formatPrice(precioOriginal)}
                </span>
                <span className="font-montserrat" style={{ fontSize: '10px', color: '#192149' }}>
                  -{descuento}%
                </span>
              </>
            ) : (
              <span className="font-montserrat" style={{ fontSize: '13px', color: '#192149' }}>
                {formatPrice(precioOriginal)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
