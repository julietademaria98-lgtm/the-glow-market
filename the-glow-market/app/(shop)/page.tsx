import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import SplitSection from '@/components/home/SplitSection'
import ProductsSlider from '@/components/home/ProductsSlider'
import EditorialSlider from '@/components/home/EditorialSlider'
import CoursesSection from '@/components/home/CoursesSection'
import type { Producto, Curso } from '@/types'

export const revalidate = 3600

async function getHomeData() {
  const supabase = await createClient()
  const [productosRes, todosRes, cursosRes] = await Promise.all([
    supabase.from('productos').select('*, imagenes:producto_imagenes(*)').eq('activo', true).eq('destacado', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('productos').select('id, slug, nombre, imagenes:producto_imagenes(*)').eq('activo', true).order('created_at', { ascending: false }),
    supabase.from('cursos').select('*, lecciones(*)').eq('activo', true).order('created_at', { ascending: false }).limit(3),
  ])
  return {
    productos: (productosRes.data || []) as Producto[],
    todos: (todosRes.data || []) as any[],
    cursos: (cursosRes.data || []) as Curso[],
  }
}

export default async function HomePage() {
  const { productos, todos, cursos } = await getHomeData()
  const sliderImages = todos
    .map((p: any) => {
      const img = p.imagenes?.find((i: any) => i.es_principal)?.url || p.imagenes?.[0]?.url
      return img ? { url: img, slug: p.slug, nombre: p.nombre } : null
    })
    .filter(Boolean) as { url: string; slug: string; nombre: string }[]
  return (
    <main>
      <HeroSection />
      <SplitSection />
      <div id="productos">
        {productos.length > 0 && <ProductsSlider productos={productos} />}
      </div>
      {sliderImages.length > 0 && <EditorialSlider images={sliderImages} />}
      {cursos.length > 0 && <CoursesSection cursos={cursos} />}
    </main>
  )
}
