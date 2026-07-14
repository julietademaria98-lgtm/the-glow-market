import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'
import StarIcon from '@/components/ui/StarIcon'
import WaitlistForm from '@/components/shop/WaitlistForm'
import type { Producto } from '@/types'

export const revalidate = 3600

interface SearchParams {
  categoria?: string
}

async function getProductos(categoria?: string): Promise<Producto[]> {
  const supabase = await createClient()

  let query = supabase
    .from('productos')
    .select('*, imagenes:producto_imagenes(*)')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (categoria && categoria !== 'todos') {
    query = query.eq('categoria', categoria)
  }

  const { data } = await query
  return (data || []) as Producto[]
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const categoria = searchParams.categoria
  const productos = await getProductos(categoria)

  return (
    <main className="min-h-screen bg-glow-cream pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-cormorant text-3xl md:text-4xl text-glow-navy font-light tracking-wide uppercase">
            The Market
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <StarIcon size={10} className="text-glow-navy" />
            <span className="font-montserrat text-[13px] tracking-[0.3em] uppercase text-glow-navy/60">
              The Flower Capsule
            </span>
            <StarIcon size={10} className="text-glow-navy" />
          </div>
          <WaitlistForm />
        </div>

        {/* Grid */}
        <ProductGrid productos={productos} />
      </div>
    </main>
  )
}
