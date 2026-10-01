'use client'

import './market.css'

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

export default function ProductCard({
  producto,
  index = 0,
}: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const mainImage =
    producto.imagenes?.find((img) => img.es_principal)?.url ||
    producto.imagenes?.[0]?.url ||
    '/placeholder-product.jpg'

  const hoverImage =
    producto.imagenes?.find((img, i) => !img.es_principal && i > 0)?.url

  const sinStock = producto.stock === 0

  const handleAddToCart = () => {
    if (sinStock) return

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group product-card-container glow-product-card"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link
        href={`/productos/${producto.slug}`}
        aria-label={producto.nombre}
        className="relative block aspect-square overflow-hidden bg-white"
        style={{
          height: 'auto',
          flexShrink: 0,
        }}
      >
        <Image
          src={mainImage}
          alt={producto.nombre}
          fill
          className="object-cover product-card-image transition-opacity duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${producto.nombre} - vista alternativa`}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {sinStock ? (
          <span className="absolute top-3 left-3 bg-glow-navy/50 text-white font-body text-[11px] tracking-widest uppercase px-2 py-1">
            Sin stock
          </span>
        ) : producto.precio_oferta ? (
          <span className="absolute top-3 left-3 bg-glow-navy text-white font-body text-[11px] tracking-widest uppercase px-2 py-1">
            Oferta
          </span>
        ) : null}

        <span
          className="absolute top-3 right-3 font-body text-[11px] tracking-widest uppercase px-2 py-1"
          style={{
            backgroundColor: '#E1C8CB',
            color: '#192149',
          }}
        >
          Regalos CLARINS
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <Link href={`/productos/${producto.slug}`}>
          <h3
            className="font-display text-glow-navy leading-tight"
            style={{ minHeight: '2.5em', marginBottom: '12px' }}
          >
            {producto.nombre}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            {producto.precio_oferta ? (
              <>
                <span className="font-body text-sm font-medium text-glow-navy">
                  {formatPrice(Number(producto.precio_oferta))}
                </span>

                <span className="font-body text-xs text-glow-navy/65 line-through">
                  {formatPrice(Number(producto.precio))}
                </span>
              </>
            ) : (
              <span className="font-body text-sm font-medium text-glow-navy">
                {formatPrice(Number(producto.precio))}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={sinStock}
            className="mt-4 w-full px-3 py-3 font-body font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: added ? '#20699F' : '#192149',
              color: '#FFFFFF',
              borderRadius: '999px',
              minHeight: '44px',
              fontSize: '13px',
              letterSpacing: 0,
              textTransform: 'none',
            }}
          >
            {sinStock
              ? 'Sin stock'
              : added
                ? '✓ Agregado'
                : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
