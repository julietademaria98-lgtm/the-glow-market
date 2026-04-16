import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/shop/ProductDetail'
import ProductGrid from '@/components/shop/ProductGrid'
import type { Producto } from '@/types'
import { Metadata } from 'next'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

async function getProducto(slug: string): Promise<Producto | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('productos')
    .select('*, imagenes:producto_imagenes(*)')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  return data as Producto | null
}

async function getRelacionados(categoria: string, excludeId: string): Promise<Producto[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('productos')
    .select('*, imagenes:producto_imagenes(*)')
    .eq('categoria', categoria)
    .eq('activo', true)
    .neq('id', excludeId)
    .limit(4)

  return (data || []) as Producto[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const producto = await getProducto(params.slug)
  if (!producto) return { title: 'Producto no encontrado' }

  return {
    title: `${producto.nombre} — The Glow Market`,
    description: producto.descripcion || undefined,
  }
}

export default async function ProductoPage({ params }: Props) {
  const producto = await getProducto(params.slug)
  if (!producto) notFound()

  const relacionados = await getRelacionados(producto.categoria, producto.id)

  return (
    <main className="min-h-screen bg-glow-cream pt-16">
      <ProductDetail producto={producto} />

      {relacionados.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 pb-20">
          <h2 className="font-cormorant text-3xl text-glow-navy font-light tracking-wide mb-8 text-center">
            También te puede gustar
          </h2>
          <ProductGrid productos={relacionados} />
        </section>
      )}
    </main>
  )
}
