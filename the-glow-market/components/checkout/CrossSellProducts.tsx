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
    <div className="bg-glow-cream mt-12 px-6 py-10 md:px-10 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap justify-center">
          <h2 className="font-cormorant text-3xl md:text-4xl text-glow-navy font-light">
            Sumá antes de pagar
          </h2>
          <span className="bg-glow-blush text-white font-montserrat text-xs font-bold tracking-wide px-3 py-1.5">
            -10% OFF
          </span>
        </div>
        <p className="font-montserrat text-sm text-glow-navy/80">
          Descuento exclusivo por agregarlo ahora, antes de pagar.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {disponibles.map((producto) => {
          const precioBase = Number(producto.precio_oferta ?? producto.precio)
          const precioConDescuento = Math.round(precioBase * (1 - DESCUENTO_CHECKOUT))
          const imagen =
            producto.imagenes?.find((img) => img.es_principal)?.url ||
            producto.imagenes?.[0]?.url ||
            '/placeholder-product.jpg'
          const yaAgregado = agregados.has(producto.id)

          return (
            <div key={producto.id} className="bg-white flex flex-col overflow-hidden shadow-sm">
              <div className="relative aspect-square w-full overflow-hidden bg-glow-cream">
                <Image
                  src={imagen}
                  alt={producto.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <span className="absolute top-2 left-2 bg-glow-blush text-white font-montserrat text-[10px] font-bold px-2 py-1">
                  -10%
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="font-montserrat text-sm text-glow-navy font-medium mb-1 leading-snug">
                  {producto.nombre}
                </p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-montserrat text-base font-semibold text-glow-navy">
                    {formatPrice(precioConDescuento)}
                  </span>
                  <span className="font-montserrat text-xs text-glow-navy/50 line-through">
                    {formatPrice(precioBase)}
                  </span>
                </div>
                <button
                  onClick={() => handleAgregar(producto)}
                  disabled={yaAgregado}
                  className={`mt-auto w-full py-2.5 font-montserrat text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                    yaAgregado
                      ? 'bg-green-700 text-white'
                      : 'bg-glow-navy text-white hover:bg-glow-blue'
                  }`}
                >
                  {yaAgregado ? '✓ Agregado' : 'Agregar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
