'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Producto } from '@/types'
import StarIcon from '@/components/ui/StarIcon'
import AddToCartButton from './AddToCartButton'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface ProductDetailProps {
  producto: Producto
}

const ACCORDIONS = [
  {
    id: 'detalles',
    label: '📐 Detalles',
    render: (p: Producto) => (
      <ul className="space-y-2 font-montserrat text-xs text-glow-navy/70 leading-relaxed">
        {p.material && <li><span className="text-glow-navy font-medium">Material:</span> {p.material}</li>}
        {p.dimensiones && <li><span className="text-glow-navy font-medium">Dimensiones:</span> {p.dimensiones}</li>}
        {p.peso && <li><span className="text-glow-navy font-medium">Peso:</span> {p.peso}</li>}
        {p.colores && p.colores.length > 0 && (
          <li><span className="text-glow-navy font-medium">Colores:</span> {p.colores.join(', ')}</li>
        )}
      </ul>
    ),
  },
  {
    id: 'cuidados',
    label: '✨ Cuidados',
    render: () => (
      <ul className="space-y-2 font-montserrat text-xs text-glow-navy/70 leading-relaxed">
        <li>Guardar lejos del sol directo para evitar oxidación.</li>
        <li>Evitar contacto en el exterior con perfumes y cremas.</li>
        <li>Limpiar con paño suave y húmedo por dentro.</li>
      </ul>
    ),
  },
  {
    id: 'envio',
    label: '📦 Envío',
    render: () => (
      <ul className="space-y-2 font-montserrat text-xs text-glow-navy/70 leading-relaxed">
        <li>Envíos a todo el país por Andreani.</li>
        <li>Tiempo estimado: 3 a 7 días hábiles.</li>
        <li>Retiro en CABA (Núñez) o Tigre con coordinación previa.</li>
      </ul>
    ),
  },
]

export default function ProductDetail({ producto }: ProductDetailProps) {
  const imagenes = producto.imagenes || []
  const mainImage = imagenes.find((img) => img.es_principal) || imagenes[0]

  const [activeImage, setActiveImage] = useState(mainImage?.url || '/placeholder-product.jpg')
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/40 mb-10 flex gap-2">
        <Link href="/" className="hover:text-glow-navy transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/productos" className="hover:text-glow-navy transition-colors">Tienda</Link>
        <span>/</span>
        <span className="text-glow-navy">{producto.nombre}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 md:gap-16">
        {/* LEFT: Images */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeImage}
                  alt={producto.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {imagenes.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {imagenes.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative w-16 h-20 flex-shrink-0 overflow-hidden transition-all duration-300 ${
                    activeImage === img.url
                      ? 'ring-1 ring-glow-navy'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <StarIcon size={14} className="text-glow-navy" />
            <h1 className="font-cormorant text-3xl md:text-4xl text-glow-navy font-light tracking-wide leading-tight">
              {producto.nombre}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            {producto.precio_oferta ? (
              <>
                <span className="font-montserrat text-2xl font-medium text-glow-navy">
                  {formatPrice(Number(producto.precio_oferta))}
                </span>
                <span className="font-montserrat text-base text-glow-navy/40 line-through">
                  {formatPrice(Number(producto.precio))}
                </span>
              </>
            ) : (
              <span className="font-montserrat text-2xl font-medium text-glow-navy">
                {formatPrice(Number(producto.precio))}
              </span>
            )}
          </div>

          <div className="h-px bg-glow-navy/10" />

          {producto.descripcion && (
            <p className="font-montserrat text-sm text-glow-navy/70 leading-relaxed">
              {producto.descripcion}
            </p>
          )}

          <div className="flex flex-col divide-y divide-glow-navy/10">
            {ACCORDIONS.map(({ id, label, render }) => (
              <div key={id}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === id ? null : id)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-montserrat text-xs tracking-[0.15em] uppercase text-glow-navy">
                    {label}
                  </span>
                  <motion.span
                    animate={{ rotate: openAccordion === id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={14} className="text-glow-navy" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openAccordion === id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5">{render(producto)}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <AddToCartButton
              producto={producto}
              mainImageUrl={activeImage}
            />
            <Link href="/checkout">
              <Button variant="outline" className="w-full" size="md">
                Comprar Ahora
              </Button>
            </Link>
          </div>

          {producto.stock <= 5 && producto.stock > 0 && (
            <p className="font-montserrat text-xs text-glow-royal tracking-wide">
              ¡Solo quedan {producto.stock} unidades!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
