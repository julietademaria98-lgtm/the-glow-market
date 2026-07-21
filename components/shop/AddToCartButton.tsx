'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Producto } from '@/types'

interface AddToCartButtonProps {
  producto: Producto
  mainImageUrl: string
}

export default function AddToCartButton({ producto, mainImageUrl }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem({
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      precio: Number(producto.precio_oferta ?? producto.precio),
      imagen_url: mainImageUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={producto.stock === 0}
      className={`w-full py-4 font-montserrat text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
        producto.stock === 0
          ? 'bg-glow-navy/30 text-white/50 cursor-not-allowed'
          : added
          ? 'bg-glow-royal text-white'
          : 'bg-glow-navy text-white hover:bg-glow-blue'
      }`}
    >
      {producto.stock === 0 ? (
        'Sin stock'
      ) : added ? (
        <>
          <Check size={14} />
          ¡Agregado al carrito!
        </>
      ) : (
        'Agregar al carrito'
      )}
    </button>
  )
}
