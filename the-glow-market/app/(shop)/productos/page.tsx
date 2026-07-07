import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'
import StarIcon from '@/components/ui/StarIcon'
import type { Producto } from '@/types'

export const revalidate = 3600

async function getProductos(): Promise<Producto[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('productos')
    .select('*, imagenes:producto_imagenes(*)')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  return (data || []) as Producto[]
}

export default async function ProductosPage() {
  const productos = await getProductos()

  return (
    <main className="min-h-screen bg-glow-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarIcon size={10} className="text-glow-navy" />
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/60">
              Colección
            </span>
            <StarIcon size={10} className="text-glow-navy" />
          </div>
          <h1 className="font-cormorant text-5xl md:text-6xl text-glow-navy font-light tracking-wide">
            Nuestra Tienda
          </h1>
        </div>

        {/* Grid */}
        <ProductGrid productos={productos} />
      </div>
    </main>
  )
}
