import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import SplitSection from '@/components/home/SplitSection'
import ProductsSlider from '@/components/home/ProductsSlider'
import EditorialBanner from '@/components/home/EditorialBanner'
import CoursesSection from '@/components/home/CoursesSection'
import CourseModulesSection from '@/components/home/CourseModulesSection'
import type { Producto, Curso } from '@/types'

export const revalidate = 3600 // revalidar cada hora

async function getHomeData() {
  const supabase = await createClient()

  const [productosRes, cursosRes] = await Promise.all([
    supabase
      .from('productos')
      .select('*, imagenes:producto_imagenes(*)')
      .eq('activo', true)
      .eq('destacado', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('cursos')
      .select('*, lecciones(*)')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  return {
    productos: (productosRes.data || []) as Producto[],
    cursos: (cursosRes.data || []) as Curso[],
  }
}

export default async function HomePage() {
  const { productos, cursos } = await getHomeData()

  return (
    <main>
      <HeroSection />
      <SplitSection />
      <div id="productos">
        {productos.length > 0 && <ProductsSlider productos={productos} />}
      </div>
      <EditorialBanner />
      <CourseModulesSection />
      {cursos.length > 0 && <CoursesSection cursos={cursos} />}
    </main>
  )
}
