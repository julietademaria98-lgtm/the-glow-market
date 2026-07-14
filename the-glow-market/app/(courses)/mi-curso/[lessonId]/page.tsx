import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import VideoPlayer from '@/components/courses/VideoPlayer'
import LessonSidebar from '@/components/courses/LessonSidebar'
import StarIcon from '@/components/ui/StarIcon'
import type { Leccion, Curso } from '@/types'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { getDescargablesByModulo } from '@/lib/descargables'

interface Props {
  params: { lessonId: string }
}

async function getLessonData(lessonId: string, userId: string) {
  const supabase = await createClient()

  const { data: leccion } = await supabase
    .from('lecciones')
    .select('*, cursos(*)')
    .eq('id', lessonId)
    .single()

  if (!leccion) return null

  const curso = leccion.cursos as Curso

  if (!leccion.es_preview) {
    const { data: acceso } = await supabase
      .from('accesos_curso')
      .select('id')
      .eq('user_id', userId)
      .eq('curso_id', leccion.curso_id)
      .eq('activo', true)
      .single()

    if (!acceso) return { leccion, curso, hasAccess: false }
  }

  const { data: lecciones } = await supabase
    .from('lecciones')
    .select('*')
    .eq('curso_id', leccion.curso_id)
    .order('orden', { ascending: true })

  return {
    leccion: leccion as Leccion,
    curso,
    lecciones: (lecciones || []) as Leccion[],
    hasAccess: true,
  }
}

export default async function LeccionPage({ params }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?redirect=/mi-curso/${params.lessonId}`)

  const data = await getLessonData(params.lessonId, user.id)
  if (!data) notFound()

  if (!data.hasAccess) {
    redirect('/cursos')
  }

  const { leccion, curso, lecciones = [] } = data
  const descargables = getDescargablesByModulo(leccion.modulo_orden, leccion.modulo)

  return (
    <main className="min-h-screen bg-glow-navy/20 flex flex-col lg:flex-row pt-16">
      <LessonSidebar
        curso={curso}
        lecciones={lecciones}
        activeLessonId={leccion.id}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 md:px-10 pt-6 pb-4">
          <nav className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/40 flex gap-2">
            <Link href="/mi-curso" className="hover:text-glow-navy transition-colors">
              Mis Cursos
            </Link>
            <span>/</span>
            <span className="text-glow-navy/60">{curso.titulo}</span>
            <span>/</span>
            <span className="text-glow-navy/80">{leccion.titulo}</span>
          </nav>
        </div>

        <div className="px-6 md:px-10">
          <VideoPlayer lessonId={leccion.id} title={leccion.titulo} />
        </div>

        <div className="px-6 md:px-10 py-8 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <StarIcon size={10} className="text-glow-blush" />
            <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-glow-navy/40">
              {leccion.duracion && `${leccion.duracion} ·`} Lección
            </span>
          </div>
          <h1 className="font-cormorant text-3xl md:text-4xl text-glow-navy font-light tracking-wide mb-4">
            {leccion.titulo}
          </h1>
          {leccion.descripcion && (
            <p className="font-montserrat text-sm text-glow-navy/70 leading-relaxed">
              {leccion.descripcion}
            </p>
          )}
        </div>

        {descargables.length > 0 && (
          <div className="px-6 md:px-10 pb-12 max-w-3xl">
            <div className="border-t border-glow-navy/10 pt-8">
              <div className="flex items-center gap-2 mb-5">
                <StarIcon size={9} className="text-glow-blush" />
                <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-glow-navy/50">
                  Descargables de este módulo
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {descargables.map((d) => (
                  <a
                    key={d.filename}
                    href={`/${d.filename}`}
                    download
                    className="group flex items-start gap-4 p-4 border border-glow-navy/15 hover:border-glow-blush/50 hover:bg-glow-navy/5 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 border border-glow-navy/20 group-hover:border-glow-blush/50 flex items-center justify-center transition-colors">
                      <Download size={13} className="text-glow-navy/40 group-hover:text-glow-blush transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-montserrat text-xs font-medium text-glow-navy group-hover:text-glow-blush transition-colors">
                        {d.titulo}
                      </p>
                      <p className="font-montserrat text-[10px] text-glow-navy/50 mt-0.5 leading-relaxed">
                        {d.subtitulo}
                      </p>
                      {d.notaExtra && (
                        <p className="font-montserrat text-[9px] text-glow-blush/60 mt-1 italic">
                          {d.notaExtra}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {leccion.modulo_orden !== 0 && descargables.every(d => d.filename !== 'kit-esencial.pdf') && (
          <div className="px-6 md:px-10 pb-12 max-w-3xl">
            <a
              href="/kit-esencial.pdf"
              download
              className="group inline-flex items-center gap-2 font-montserrat text-[10px] tracking-[0.15em] uppercase text-glow-navy/40 hover:text-glow-blush transition-colors border-b border-glow-navy/15 hover:border-glow-blush/30 pb-0.5"
            >
              <Download size={10} />
              Consultá el Kit Esencial completo
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
