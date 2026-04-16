import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/courses/CourseCard'
import StarIcon from '@/components/ui/StarIcon'
import type { Curso } from '@/types'
import Link from 'next/link'

export const revalidate = 3600

async function getCursos(): Promise<Curso[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cursos')
    .select('*, lecciones(*)')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  return (data || []) as Curso[]
}

export default async function CursosPage() {
  const cursos = await getCursos()

  return (
    <main className="min-h-screen bg-glow-cream pt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarIcon size={10} className="text-glow-navy" />
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/60">
              Formación Online
            </span>
            <StarIcon size={10} className="text-glow-navy" />
          </div>
          <h1 className="font-cormorant text-5xl md:text-6xl text-glow-navy font-light tracking-wide mb-4">
            Cursos Online
          </h1>
          <p className="font-montserrat text-sm text-glow-navy/60 max-w-md mx-auto leading-relaxed">
            Aprendé a brillar con The Glow Market. Formación exclusiva para mujeres que quieren potenciar su estilo y negocio.
          </p>
        </div>

        {/* Courses grid */}
        {cursos.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-cormorant text-2xl text-glow-navy/40">
              Próximamente nuevos cursos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cursos.map((curso, i) => (
              <CourseCard key={curso.id} curso={curso} index={i} />
            ))}
          </div>
        )}

        {/* Already a student */}
        <div className="text-center mt-16 py-10 border-t border-glow-navy/10">
          <p className="font-montserrat text-sm text-glow-navy/50 mb-3">
            ¿Ya sos alumna?
          </p>
          <Link
            href="/login"
            className="font-montserrat text-xs tracking-[0.2em] uppercase text-glow-navy border-b border-glow-navy/30 hover:border-glow-navy pb-0.5 transition-colors"
          >
            Ingresar a mi curso →
          </Link>
        </div>
      </div>
    </main>
  )
}
