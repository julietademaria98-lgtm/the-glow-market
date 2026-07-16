import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/courses/CourseCard'
import StarIcon from '@/components/ui/StarIcon'
import type { Curso } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 0

async function getCursosConAcceso() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: cursos } = await supabase
    .from('cursos')
    .select('*, lecciones(*)')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (!cursos) return []

  if (!user) return cursos.map((c) => ({ ...c, hasAccess: false }))

  const { data: accesos } = await supabase
    .from('accesos_curso')
    .select('curso_id')
    .eq('user_id', user.id)
    .eq('activo', true)

  const accesoIds = new Set((accesos || []).map((a) => a.curso_id))

  return cursos.map((c) => ({ ...c, hasAccess: accesoIds.has(c.id) }))
}

export default async function CursosPage() {
  const cursos = await getCursosConAcceso()

  return (
    <main className="min-h-screen bg-glow-navy/70 pt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-12 mb-20">
          <div className="flex-shrink-0">
            <Image
              src="/images/Recurso 20Iso (1).png"
              alt="The Glow Market"
              width={220}
              height={220}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col items-start">
            <span className="font-montserrat text-[13px] tracking-[0.3em] uppercase text-white/50 mb-8">
              + Formación Exclusiva +
            </span>
            <h1
              className="font-cormorant text-white font-light leading-none uppercase"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)', letterSpacing: '0.05em' }}
            >
              Cursos Online
            </h1>
            <div className="flex items-center gap-3 mt-4">
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

        {cursos.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-cormorant text-2xl text-white/40">
              Próximamente nuevos cursos
            </p>
          </div>
        ) : (
          <div className={`grid gap-8 ${cursos.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 md:grid-cols-2'}`}>
            {cursos.map((curso, i) => (
              <CourseCard key={curso.id} curso={curso} index={i} hasAccess={curso.hasAccess} />
            ))}
          </div>
        )}

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
