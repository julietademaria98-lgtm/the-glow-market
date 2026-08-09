'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Producto } from '@/types'

const DESCUENTO_CHECKOUT = 0.1

export default function CrossSellProducts() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [agregados, setAgregados] = useState<Set<string>>(new Set())
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const closeCart = useCartStore((state) => state.closeCart)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('productos')
      .select('*, imagenes:producto_imagenes(*)')
      .eq('activo', true)
      .gt('stock', 0)
      .order('destacado', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        setProductos((data || []) as Producto[])
        setLoading(false)
      })
  }, [])

  const idsEnCarrito = new Set(items.map((i) => i.id))
  const disponibles = productos.filter((p) => !idsEnCarrito.has(p.id))

  if (loading || disponibles.length === 0) return null

  const handleAgregar = (producto: Producto) => {
    const precioBase = Number(producto.precio_oferta ?? producto.precio)
    const precioConDescuento = Math.round(precioBase * (1 - DESCUENTO_CHECKOUT))
    const imagen =
      producto.imagenes?.find((img) => img.es_principal)?.url ||
      producto.imagenes?.[0]?.url ||
      ''

    addItem({
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      precio: precioConDescuento,
      imagen_url: imagen,
      tipo: 'producto',
    })
    closeCart()
    setAgregados((prev) => new Set(prev).add(producto.id))
  }

  return (
    <div className="border-t border-glow-navy/10 pt-6 mt-2">
      <div className="flex items-center gap-2 mb-1">
        <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/60">
          Sumá antes de pagar
        </p>
        <span className="bg-glow-blush text-white font-montserrat text-[9px] font-bold tracking-wide px-2 py-0.5">
          -10%
        </span>
      </div>
      <p className="font-montserrat text-[10px] text-glow-navy/40 mb-4">
        Descuento exclusivo por agregarlo acá, antes de pagar.
      </p>

      <div className="flex flex-col gap-3">
        {disponibles.map((producto) => {
          const precioBase = Number(producto.precio_oferta ?? producto.precio)
          const precioConDescuento = Math.round(precioBase * (1 - DESCUENTO_CHECKOUT))
          const imagen =
            producto.imagenes?.find((img) => img.es_principal)?.url ||
            producto.imagenes?.[0]?.url ||
            '/placeholder-product.jpg'
          const yaAgregado = agregados.has(producto.id)

          return (
            <div key={producto.id} className="flex gap-3 items-center">
              <div className="relative w-12 h-14 flex-shrink-0 overflow-hidden bg-glow-cream">
                <Image src={imagen} alt={producto.nombre} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-montserrat text-xs text-glow-navy truncate">{producto.nombre}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-montserrat text-xs font-medium text-glow-navy">
                    {formatPrice(precioConDescuento)}
                  </span>
                  <span className="font-montserrat text-[10px] text-glow-navy/40 line-through">
                    {formatPrice(precioBase)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleAgregar(producto)}
                disabled={yaAgregado}
                className={`flex-shrink-0 font-montserrat text-[9px] tracking-[0.15em] uppercase px-3 py-2 transition-colors duration-300 ${
                  yaAgregado
                    ? 'bg-green-700 text-white'
                    : 'border border-glow-navy text-glow-navy hover:bg-glow-navy hover:text-white'
                }`}
              >
                {yaAgregado ? '✓' : 'Agregar'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
