import ProductCard from './ProductCard'
import type { Producto } from '@/types'

interface ProductGridProps {
  productos: Producto[]
}

export default function ProductGrid({ productos }: ProductGridProps) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-cormorant text-2xl text-glow-navy/40">
          No hay productos disponibles
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {productos.map((producto, index) => (
        <ProductCard key={producto.id} producto={producto} index={index} />
      ))}
    </div>
  )
}
