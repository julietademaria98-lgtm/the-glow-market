'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Curso } from '@/types'

export default function AddToCartCurso({ curso }: { curso: Curso }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const handleComprar = () => {
    setLoading(true)
    addItem({
      id: curso.id,
      slug: curso.slug,
      nombre: curso.titulo,
      precio: Number(curso.precio_oferta ?? curso.precio),
      imagen_url: curso.imagen_url || '',
      tipo: 'curso',
    })
    router.push('/checkout')
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
        onClick={handleComprar}
        disabled={loading}
        className="w-full max-w-sm py-4 font-montserrat text-[11px] tracking-[0.25em] uppercase bg-glow-navy text-white hover:bg-glow-blue transition-colors duration-300 disabled:opacity-60"
      >
        {loading ? 'Redirigiendo...' : 'Comprar'}
      </button>
    </div>
  )
}
