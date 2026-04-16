import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import VideoPlayer from '@/components/courses/VideoPlayer'
import LessonSidebar from '@/components/courses/LessonSidebar'
import StarIcon from '@/components/ui/StarIcon'
import type { Leccion, Curso } from '@/types'
import Link from 'next/link'

interface Props {
  params: { lessonId: string }
}

async function getLessonData(lessonId: string, userId: string) {
  const supabase = await createClient()

  // Obtener la lección y su curso
  const { data: leccion } = await supabase
    .from('lecciones')
    .select('*, cursos(*)')
    .eq('id', lessonId)
    .single()

  if (!leccion) return null

  const curso = leccion.cursos as Curso

  // Si no es preview, verificar acceso
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

  // Todas las lecciones del curso
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

  return (
    <main className="min-h-screen bg-glow-dark flex flex-col lg:flex-row pt-16">
      {/* Sidebar */}
      <LessonSidebar
        curso={curso}
        lecciones={lecciones}
        activeLessonId={leccion.id}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="px-6 md:px-10 pt-6 pb-4">
          <nav className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-white/30 flex gap-2">
            <Link href="/mi-curso" className="hover:text-white/60 transition-colors">
              Mis Cursos
            </Link>
            <span>/</span>
            <span className="text-white/50">{curso.titulo}</span>
            <span>/</span>
            <span className="text-white/70">{leccion.titulo}</span>
          </nav>
        </div>

        {/* Video */}
        <div className="px-6 md:px-10">
          <VideoPlayer lessonId={leccion.id} title={leccion.titulo} />
        </div>

        {/* Lesson info */}
        <div className="px-6 md:px-10 py-8 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <StarIcon size={10} className="text-glow-blush" />
            <span className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-white/30">
              {leccion.duracion && `${leccion.duracion} ·`} Lección
            </span>
          </div>
          <h1 className="font-cormorant text-3xl md:text-4xl text-white font-light tracking-wide mb-4">
            {leccion.titulo}
          </h1>
          {leccion.descripcion && (
            <p className="font-montserrat text-sm text-white/60 leading-relaxed">
              {leccion.descripcion}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
