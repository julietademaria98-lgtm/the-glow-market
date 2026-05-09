'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Producto } from '@/types'

interface ProductCardProps {
  producto: Producto
  index?: number
}

export default function ProductCard({ producto, index = 0 }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const mainImage =
    producto.imagenes?.find((img) => img.es_principal)?.url ||
    producto.imagenes?.[0]?.url ||
    '/placeholder-product.jpg'

  const hoverImage =
    producto.imagenes?.find((img, i) => !img.es_principal && i > 0)?.url

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      precio: Number(producto.precio_oferta ?? producto.precio),
      imagen_url: mainImage,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/productos/${producto.slug}`} className="block">
        {/* Image container */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: '3 / 4', backgroundColor: '#F2F0EC' }}
        >
          <Image
            src={mainImage}
            alt={producto.nombre}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${producto.nombre} - vista alternativa`}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Oferta badge */}
          {producto.precio_oferta && (
            <div className="absolute top-3 left-3 bg-glow-navy text-white font-montserrat text-[9px] tracking-widest uppercase px-2 py-1">
              Oferta
            </div>
          )}

          {/* Add to cart — aparece en hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 font-montserrat text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                added
                  ? 'bg-glow-navy/80 text-white'
                  : 'bg-white/90 text-glow-navy hover:bg-glow-navy hover:text-white'
              }`}
            >
              {added ? '✓ Agregado' : 'Agregar al carrito'}
            </button>
          </div>
        </div>

        {/* Product info — nombre izquierda, precio derecha */}
        <div className="flex items-baseline justify-between mt-3 px-0.5">
          <h3 className="font-montserrat text-[11px] tracking-[0.15em] uppercase text-glow-navy">
            {producto.nombre}
          </h3>
          <div className="flex items-baseline gap-2 shrink-0 ml-2">
            {producto.precio_oferta ? (
              <>
                <span className="font-montserrat text-[11px] text-glow-navy">
                  {formatPrice(Number(producto.precio_oferta))}
                </span>
                <span className="font-montserrat text-[10px] text-glow-navy/40 line-through">
                  {formatPrice(Number(producto.precio))}
                </span>
              </>
            ) : (
              <span className="font-montserrat text-[11px] text-glow-navy">
                {formatPrice(Number(producto.precio))}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
