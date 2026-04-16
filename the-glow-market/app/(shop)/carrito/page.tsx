'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-glow-cream pt-24 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 px-6">
          <StarIcon size={48} className="text-glow-navy/20" />
          <h1 className="font-cormorant text-4xl text-glow-navy font-light">
            Tu carrito está vacío
          </h1>
          <p className="font-montserrat text-xs text-glow-navy/50 max-w-xs leading-relaxed">
            Explorá nuestra colección y encontrá piezas que te hagan brillar.
          </p>
          <Link href="/productos">
            <Button variant="primary" size="md">
              Explorar Tienda
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-glow-cream pt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <StarIcon size={12} className="text-glow-navy" />
          <h1 className="font-cormorant text-4xl md:text-5xl text-glow-navy font-light tracking-wide">
            Tu Carrito
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Items */}
          <div>
            <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-3 mb-3 border-b border-glow-navy/10">
              {['Producto', 'Precio', 'Cantidad', 'Total'].map((h) => (
                <span
                  key={h}
                  className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40"
                >
                  {h}
                </span>
              ))}
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center py-6 border-b border-glow-navy/10"
                >
                  {/* Product */}
                  <div className="flex gap-4 items-start">
                    <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-white">
                      <Image
                        src={item.imagen_url || '/placeholder-product.jpg'}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-cormorant text-lg text-glow-navy leading-tight">
                        {item.nombre}
                      </p>
                      <p className="font-montserrat text-xs text-glow-navy/50 md:hidden">
                        {formatPrice(item.precio)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 font-montserrat text-[10px] tracking-wide uppercase text-glow-navy/30 hover:text-glow-navy transition-colors w-fit mt-2"
                      >
                        <Trash2 size={10} />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <span className="hidden md:block font-montserrat text-sm text-glow-navy">
                    {formatPrice(item.precio)}
                  </span>

                  {/* Qty */}
                  <div className="flex items-center gap-2 border border-glow-navy/20 w-fit px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-glow-navy hover:opacity-60 transition-opacity p-1"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="font-montserrat text-xs w-6 text-center text-glow-navy">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-glow-navy hover:opacity-60 transition-opacity p-1"
                    >
                      <Plus size={10} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="font-montserrat text-sm font-medium text-glow-navy">
                    {formatPrice(item.precio * item.quantity)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="bg-white p-8 flex flex-col gap-6 h-fit sticky top-24">
            <h2 className="font-cormorant text-2xl text-glow-navy font-light">Resumen</h2>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="font-montserrat text-xs text-glow-navy/60">
                    {item.nombre} × {item.quantity}
                  </span>
                  <span className="font-montserrat text-xs text-glow-navy">
                    {formatPrice(item.precio * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-glow-navy/10" />

            <div className="flex justify-between items-baseline">
              <span className="font-montserrat text-xs tracking-[0.15em] uppercase text-glow-navy/60">
                Total
              </span>
              <span className="font-cormorant text-3xl text-glow-navy">
                {formatPrice(total())}
              </span>
            </div>

            <Link href="/checkout">
              <Button variant="primary" className="w-full" size="md">
                Proceder al Checkout
              </Button>
            </Link>

            <Link href="/productos" className="text-center">
              <span className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy transition-colors">
                Seguir Comprando
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
