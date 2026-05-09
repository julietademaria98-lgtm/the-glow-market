import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import StarIcon from '@/components/ui/StarIcon'
import TestimonialForm from '@/components/courses/TestimonialForm'
import type { Curso } from '@/types'

async function getMisCursos(userId: string): Promise<Curso[]> {
  const supabase = await createClient()

  const { data: accesos } = await supabase
    .from('accesos_curso')
    .select('curso_id')
    .eq('user_id', userId)
    .eq('activo', true)

  if (!accesos || accesos.length === 0) return []

  const ids = accesos.map((a) => a.curso_id)
  const { data } = await supabase
    .from('cursos')
    .select('*, lecciones(*)')
    .in('id', ids)
    .eq('activo', true)

  return (data || []) as Curso[]
}

async function getMisTestimonios(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonios')
    .select('curso_id')
    .eq('user_id', userId)
  return (data || []).map((t) => t.curso_id)
}

export default async function MiCursoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/mi-curso')

  const [cursos, testimoniосEnviados] = await Promise.all([
    getMisCursos(user.id),
    getMisTestimonios(user.id),
  ])

  const nombreUsuario = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Alumna'

  return (
    <main className="min-h-screen bg-glow-cream pt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <StarIcon size={10} className="text-glow-navy" />
            <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/60">
              Bienvenida
            </span>
          </div>
          <h1 className="font-cormorant text-4xl md:text-5xl text-glow-navy font-light tracking-wide">
            Mis Cursos
          </h1>
        </div>

        {cursos.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-6">
            <StarIcon size={48} className="text-glow-navy/20" />
            <p className="font-cormorant text-2xl text-glow-navy/40">
              Todavía no tenés cursos
            </p>
            <Link
              href="/cursos"
              className="font-montserrat text-xs tracking-[0.2em] uppercase text-glow-navy border-b border-glow-navy/30 hover:border-glow-navy pb-0.5 transition-colors"
            >
              Explorar cursos disponibles →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {cursos.map((curso) => {
              const primeraLeccion = curso.lecciones?.sort((a, b) => a.orden - b.orden)?.[0]
              const yaEnvioTestimonio = testimoniосEnviados.includes(curso.id)

              return (
                <div key={curso.id} className="flex flex-col gap-8">
                  {/* Card del curso */}
                  <Link
                    href={primeraLeccion ? `/mi-curso/${primeraLeccion.id}` : '/cursos'}
                    className="group block bg-white hover:shadow-md transition-shadow duration-300 max-w-sm"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={curso.imagen_url || '/placeholder-course.jpg'}
                        alt={curso.titulo}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-glow-navy/20" />
                      <div className="absolute top-3 right-3 bg-glow-navy text-white font-montserrat text-[9px] tracking-widest uppercase px-3 py-1 flex items-center gap-1">
                        <StarIcon size={7} /> Activo
                      </div>
                    </div>
                    <div className="p-5">
                      <h2 className="font-cormorant text-xl text-glow-navy font-light mb-1">
                        {curso.titulo}
                      </h2>
                      <p className="font-montserrat text-[10px] text-glow-navy/40 uppercase tracking-widest">
                        {curso.lecciones?.length || 0} lecciones
                      </p>
                    </div>
                  </Link>

                  {/* Formulario de testimonio */}
                  {!yaEnvioTestimonio && (
                    <div className="max-w-xl">
                      <p className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 mb-4">
                        ¿Qué te pareció el curso?
                      </p>
                      <TestimonialForm
                        cursoId={curso.id}
                        userId={user.id}
                        nombreUsuario={nombreUsuario}
                      />
                    </div>
                  )}

                  {yaEnvioTestimonio && (
                    <p className="font-cormorant italic text-glow-navy/40 text-lg">
                      Ya enviaste tu testimonio para este curso ✓
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
