import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/courses/CourseCard'
import StarIcon from '@/components/ui/StarIcon'
import type { Curso } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

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
    <main className="min-h-screen bg-glow-navy pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">

        {/* Header — logo circular + título */}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-12 mb-20">
          {/* Logo circular */}
          <div className="flex-shrink-0">
            <Image
              src="/images/Recurso 20Iso (1).png"
              alt="The Glow Market"
              width={220}
              height={220}
              className="object-contain"
            />
          </div>

          {/* Título + sponsored */}
          <div className="flex flex-col items-start">
            {/* Formación Exclusiva */}
            <span className="font-montserrat text-[13px] tracking-[0.3em] uppercase text-white/50 mb-2">
              + Formación Exclusiva +
            </span>

            {/* Título principal */}
            <h1
              className="font-cormorant text-white font-light leading-none uppercase"
              style={{ fontSize: 'clamp(38px, 5.5vw, 84px)', letterSpacing: '0.05em' }}
            >
              Cursos Online
            </h1>

            {/* Sponsored by Clarins — todo junto, misma distancia que arriba */}
            <div className="flex items-center gap-3 mt-2">
              <span
                className="font-cormorant text-white/70 italic"
                style={{ fontSize: 'clamp(18px, 2vw, 28px)' }}
              >
                Sponsored by
              </span>
              <Image
                src="/images/Clarins.svg.png"
                alt="Clarins"
                width={90}
                height={28}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }}
              />
            </div>
          </div>
        </div>

        {/* Courses grid */}
        {cursos.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-cormorant text-2xl text-white/40">
              Próximamente nuevos cursos
            </p>
          </div>
        ) : (
          <div className={`grid gap-8 ${cursos.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 md:grid-cols-2'}`}>
            {cursos.map((curso, i) => (
              <CourseCard key={curso.id} curso={curso} index={i} />
            ))}
          </div>
        )}

        {/* Already a student */}
        <div className="text-center mt-16 py-10 border-t border-white/10">
          <p className="font-montserrat text-sm text-white/40 mb-3">
            ¿Ya sos alumna?
          </p>
          <Link
            href="/login"
            className="font-montserrat text-xs tracking-[0.2em] uppercase text-white/70 border-b border-white/30 hover:border-white pb-0.5 transition-colors"
          >
            Ingresar a mi curso →
          </Link>
        </div>
      </div>
    </main>
  )
}
