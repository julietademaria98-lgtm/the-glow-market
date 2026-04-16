'use client'

import { useCartStore } from '@/store/cartStore'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import StarIcon from '@/components/ui/StarIcon'
import Button from '@/components/ui/Button'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-glow-dark/40 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-glow-cream z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-glow-navy/10">
              <div className="flex items-center gap-3">
                <StarIcon size={12} className="text-glow-navy" />
                <h2 className="font-montserrat text-xs tracking-[0.3em] uppercase text-glow-navy">
                  Tu Carrito
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-glow-navy hover:opacity-60 transition-opacity p-1"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <StarIcon size={32} className="text-glow-navy/20" />
                  <p className="font-cormorant text-2xl text-glow-navy/40">
                    Tu carrito está vacío
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closeCart}
                    className="mt-2"
                  >
                    Explorar Tienda
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      {/* Imagen */}
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-white">
                        <Image
                          src={item.imagen_url || '/placeholder-product.jpg'}
                          alt={item.nombre}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <p className="font-cormorant text-lg text-glow-navy leading-tight">
                          {item.nombre}
                        </p>
                        <p className="font-montserrat text-xs text-glow-navy font-medium">
                          {formatPrice(item.precio)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-glow-navy/30 text-glow-navy hover:border-glow-navy transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="font-montserrat text-xs w-4 text-center text-glow-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-glow-navy/30 text-glow-navy hover:border-glow-navy transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-glow-navy/30 hover:text-glow-navy transition-colors self-start mt-1 p-1"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-glow-navy/10 flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-montserrat text-xs tracking-[0.15em] uppercase text-glow-navy/60">
                    Subtotal
                  </span>
                  <span className="font-cormorant text-2xl text-glow-navy">
                    {formatPrice(total())}
                  </span>
                </div>

                <Link href="/checkout" onClick={closeCart}>
                  <Button variant="primary" className="w-full" size="md">
                    Ir al Checkout
                  </Button>
                </Link>

                <button
                  onClick={closeCart}
                  className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/50 hover:text-glow-navy transition-colors text-center"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
