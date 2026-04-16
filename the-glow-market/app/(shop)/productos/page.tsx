import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'
import StarIcon from '@/components/ui/StarIcon'
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

const CATEGORIAS = [
  { value: 'todos', label: 'Todos' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'joyeria', label: 'Joyería' },
  { value: 'collares', label: 'Collares' },
  { value: 'aros', label: 'Aros' },
  { value: 'anillos', label: 'Anillos' },
  { value: 'pulseras', label: 'Pulseras' },
]

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

        {/* Filtros por categoría */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIAS.map(({ value, label }) => (
            <a
              key={value}
              href={`/productos${value !== 'todos' ? `?categoria=${value}` : ''}`}
              className={`font-montserrat text-[10px] tracking-[0.2em] uppercase px-5 py-2 border transition-all duration-300 ${
                (categoria === value) || (!categoria && value === 'todos')
                  ? 'bg-glow-navy text-white border-glow-navy'
                  : 'border-glow-navy/30 text-glow-navy hover:border-glow-navy'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Grid */}
        <ProductGrid productos={productos} />
      </div>
    </main>
  )
}
