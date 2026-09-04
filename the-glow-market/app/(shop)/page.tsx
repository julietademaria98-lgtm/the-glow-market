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

  const [productosRes, cursosRes, sliderRes] = await Promise.all([
    supabase
      .from('productos')
      .select('*, imagenes:producto_imagenes(*)')
      .eq('activo', true)
      .eq('destacado', true)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('cursos')
      .select('*, lecciones(*)')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('slider_imagenes')
      .select('url')
      .eq('activo', true)
      .order('orden', { ascending: true }),
  ])

  return {
    productos: (productosRes.data || []) as Producto[],
    cursos: (cursosRes.data || []) as Curso[],
    sliderImagenes: (sliderRes.data || []) as { url: string }[],
  }
}

export default async function HomePage() {
  const { productos, cursos, sliderImagenes } = await getHomeData()

  return (
    <main>
      <HeroSection />
      <SplitSection />
      <div id="productos">
        {productos.length > 0 && <ProductsSlider productos={productos} />}
      </div>
      {sliderImagenes.length > 0 && <EditorialSlider images={sliderImagenes} />}
      {cursos.length > 0 && <CoursesSection cursos={cursos} />}
    </main>
  )
}
