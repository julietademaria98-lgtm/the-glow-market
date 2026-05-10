import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/courses/CourseCard'
import Image from 'next/image'
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

async function getTestimonios() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonios')
    .select('*')
    .eq('aprobado', true)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function CursosPage() {
  const [cursos, testimonios] = await Promise.all([getCursos(), getTestimonios()])

  return (
    <main className="min-h-screen bg-glow-navy">

      {/* HEADER */}
      <div className="max-w-[1200px] mx-auto px-6 pt-36 pb-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-16">

          {/* Logo circular */}
          <div className="shrink-0">
            <Image
              src="/images/Recurso 20Iso (1).png"
              alt="The Glow Market"
              width={200}
              height={200}
              className="w-32 md:w-48 lg:w-56 object-contain opacity-90"
            />
          </div>

          {/* Título */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white/40" style={{ fontSize: '10px' }}>+</span>
              <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-white/40">
                Formación Exclusiva
              </span>
              <span className="text-white/40" style={{ fontSize: '10px' }}>+</span>
            </div>
            <h1
              className="font-cormorant text-white font-light leading-none mb-4"
              style={{ fontSize: 'clamp(52px, 10vw, 120px)', letterSpacing: '0.05em' }}
            >
              Cursos Online
            </h1>
            <div className="flex items-center gap-3">
              <p className="font-cormorant italic text-white/50" style={{ fontSize: 'clamp(18px, 2vw, 26px)' }}>
                Sponsored by
              </p>
              <Image
                src="/images/Clarins.svg.png"
                alt="Clarins"
                width={80}
                height={24}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* COURSES GRID */}
      <div className="max-w-[1200px] mx-auto px-6 pb-20">
        {cursos.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-cormorant text-2xl text-white/40">
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
        <div className="text-center mt-16 py-10 border-t border-white/10">
          <p className="font-montserrat text-sm text-white/30 mb-3">
            ¿Ya sos alumna?
          </p>
          <Link
            href="/login"
            className="font-montserrat text-xs tracking-[0.2em] uppercase text-white/60 border-b border-white/20 hover:text-white hover:border-white pb-0.5 transition-colors"
          >
            Ingresar a mi curso →
          </Link>
        </div>
      </div>

      {/* TESTIMONIOS */}
      {testimonios.length > 0 && (
        <div className="border-t border-white/10 py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <p className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-white/40 mb-3">
                Testimonios
              </p>
              <h2 className="font-cormorant text-white font-light" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                Lo que dicen nuestras alumnas
              </h2>
            </div>

            <div className={`grid grid-cols-1 gap-px bg-white/10 ${testimonios.length === 1 ? 'md:grid-cols-1 max-w-lg mx-auto' : testimonios.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {testimonios.map((t: any) => (
                <div key={t.id} className="bg-glow-navy p-8 md:p-10 flex flex-col gap-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#E9E2DA" opacity="0.7">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="font-cormorant italic text-white/80 leading-relaxed flex-1" style={{ fontSize: 'clamp(17px, 1.8vw, 21px)' }}>
                    "{t.texto}"
                  </p>
                  <div className="border-t border-white/10 pt-5">
                    <p className="font-cormorant text-white" style={{ fontSize: '18px' }}>
                      {t.nombre_publico}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
