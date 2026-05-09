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

const testimonios = [
  {
    texto: 'Nunca pensé que maquillarme podía ser tan simple. Ahora salgo en 10 minutos y me veo increíble.',
    nombre: 'Valentina M.',
    descripcion: 'Mamá y emprendedora',
  },
  {
    texto: 'El módulo de base y corrector me cambió la vida. Por fin entendí cómo usar los productos que ya tenía.',
    nombre: 'Sofía R.',
    descripcion: 'Estudiante universitaria',
  },
  {
    texto: 'Lo que más me gustó es que es real. Sin filtros, sin productos carísimos. Maquillaje para el día a día.',
    nombre: 'Camila T.',
    descripcion: 'Profesional de salud',
  },
]

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
            Aprendé a brillar con The Glow Market
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

      {/* TESTIMONIOS */}
      <div className="bg-glow-navy py-20 px-6 mt-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-white/40 mb-3">
              Testimonios
            </p>
            <h2 className="font-cormorant text-white font-light" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              Lo que dicen nuestras alumnas
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-glow-navy p-8 md:p-10 flex flex-col gap-6">
                {/* Estrellas */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#E9E2DA" opacity="0.7">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="font-cormorant italic text-white/80 leading-relaxed flex-1" style={{ fontSize: 'clamp(17px, 1.8vw, 21px)' }}>
                  "{t.texto}"
                </p>

                {/* Persona */}
                <div className="border-t border-white/10 pt-5">
                  <p className="font-cormorant text-white" style={{ fontSize: '18px' }}>
                    {t.nombre}
                  </p>
                  <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">
                    {t.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  )
}
