'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Curso } from '@/types'

export default function AddToCartCurso({ curso }: { curso: Curso }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
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

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-baseline gap-3 justify-center">
        {curso.precio_oferta ? (
          <>
            <span className="font-montserrat text-2xl font-medium text-glow-navy">
              {formatPrice(curso.precio_oferta)}
            </span>
            <span className="font-montserrat text-sm text-glow-navy/40 line-through">
              {formatPrice(curso.precio)}
            </span>
          </>
        ) : (
          <span className="font-montserrat text-2xl font-medium text-glow-navy">
            {formatPrice(curso.precio)}
          </span>
        )}
      </div>
      <p className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-glow-navy/40">
        Precio de lanzamiento
      </p>
      <button
        onClick={handleAdd}
        className={`w-full max-w-sm py-4 font-montserrat text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
          added ? 'bg-green-700 text-white' : 'bg-glow-navy text-white hover:bg-glow-blue'
        }`}
      >
        {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
      </button>
    </div>
  )
}
