import '@/components/ui/glow-spaces.css'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import VideoPlayer from '@/components/courses/VideoPlayer'
import LessonSidebar from '@/components/courses/LessonSidebar'
import StarIcon from '@/components/ui/StarIcon'
import type { Leccion, Curso } from '@/types'
import Link from 'next/link'
import { Download, ExternalLink } from 'lucide-react'
import { getDescargablesByModulo } from '@/lib/descargables'
import { getProductosByModulo } from '@/lib/productos'
import ReviewForm from '@/components/courses/ReviewForm'

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

    if (!acceso) {
      return { leccion, curso, hasAccess: false }
    }
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

  if (!user) {
    redirect(`/login?redirect=/mi-curso/${params.lessonId}`)
  }

  const data = await getLessonData(params.lessonId, user.id)
  if (!data) notFound()

  if (!data.hasAccess) redirect('/cursos')

  const { leccion, curso, lecciones = [] } = data
  const descargables = getDescargablesByModulo(
    leccion.modulo_orden,
    leccion.modulo
  )
  const productos = getProductosByModulo(leccion.modulo_orden)

  // Check if already reviewed (for Módulo 4)
  const { data: existingReview } = leccion.modulo_orden === 4
    ? await supabase.from('reviews').select('cupon_codigo').eq('user_id', user!.id).single()
    : { data: null }

  return (
    <main className="glow-space glow-classroom min-h-screen bg-glow-navy/20 flex flex-col lg:flex-row pt-16">
      <LessonSidebar
        curso={curso}
        lecciones={lecciones}
        activeLessonId={leccion.id}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 md:px-10 pt-6 pb-4">
          <nav className="font-body text-xs tracking-[0.15em] uppercase text-glow-navy/60 flex gap-2">
            <Link
              href="/mi-curso"
              className="hover:text-glow-navy transition-colors"
            >
              Mis Cursos
            </Link>
            <span>/</span>
            <span className="text-glow-navy/80">{curso.titulo}</span>
            <span>/</span>
            <span className="text-glow-navy">{leccion.titulo}</span>
          </nav>
        </div>

        <div id="video-section" className="px-6 md:px-10">
          <VideoPlayer lessonId={leccion.id} title={leccion.titulo} />
        </div>

        <div className="px-6 md:px-10 py-8 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <StarIcon size={10} className="text-glow-royal" />
            <span className="font-body text-[11px] tracking-[0.2em] uppercase text-glow-navy/70">
              {leccion.duracion && `${leccion.duracion} ·`} Lección
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-glow-navy font-light tracking-wide mb-4">
            {leccion.titulo}
          </h1>

          {leccion.descripcion && (
            <p className="font-body text-sm text-glow-navy/90 leading-relaxed">
              {leccion.descripcion}
            </p>
          )}
        </div>

        {descargables.length > 0 && (
          <div className="px-6 md:px-10 pb-12 max-w-3xl">
            <div className="border-t border-glow-navy/10 pt-8">
              <div className="flex items-center gap-2 mb-5">
                <StarIcon size={9} className="text-glow-royal" />
                <span className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-glow-navy/80">
                  Recursos de este módulo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {descargables.map((recurso) => (
                  <a
                    key={recurso.filename}
                    href={`/${recurso.filename}`}
                    download
                    className="group flex items-start gap-4 p-4 border border-glow-navy/15 hover:border-glow-royal/50 hover:bg-glow-navy/5 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 border border-glow-navy/20 group-hover:border-glow-royal/50 flex items-center justify-center transition-colors">
                      <Download
                        size={13}
                        className="text-glow-navy/65 group-hover:text-glow-royal transition-colors"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-medium text-glow-navy group-hover:text-glow-royal transition-colors">
                        {recurso.titulo}
                      </p>
                      <p className="font-body text-xs text-glow-navy/75 mt-0.5 leading-relaxed">
                        {recurso.subtitulo}
                      </p>

                      {recurso.notaExtra && (
                        <p className="font-body text-[11px] text-glow-royal/60 mt-1 italic">
                          {recurso.notaExtra}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {productos.length > 0 && (
          <div className="px-6 md:px-10 pb-16 max-w-3xl">
            <div className="border-t border-glow-navy/10 pt-8">
              <div className="flex items-center gap-2 mb-5">
                <StarIcon size={9} className="text-glow-royal" />
                <span className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-glow-navy/80">
                  Productos de este módulo
                </span>
              </div>

              <div className="flex flex-col divide-y divide-glow-navy/8">
                {productos.map((producto) => (
                  <a
                    key={producto.nombre}
                    href={producto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 hover:text-glow-royal transition-colors"
                  >
                    <span className="font-body text-xs text-glow-navy/80 group-hover:text-glow-royal transition-colors">
                      {producto.nombre}
                    </span>
                    <ExternalLink
                      size={11}
                      className="text-glow-navy/65 group-hover:text-glow-royal transition-colors flex-shrink-0 ml-3"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {leccion.modulo_orden === 4 && (
          <div className="px-6 md:px-10 pb-16 max-w-3xl">
            <div className="border-t border-glow-navy/10 pt-8">
              {existingReview ? (
                <div style={{ background: '#f4efea', borderRadius: 20, padding: '48px 6%', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', color: '#192149' }}>✦ ¡YA DEJASTE TU RESEÑA!</p>
                  <h2 style={{ margin: 0, fontFamily: 'var(--font-title, Georgia, serif)', fontWeight: 400, fontSize: 36, lineHeight: 1.1, color: '#192149' }}>
                    Tu código: <em style={{ background: 'linear-gradient(transparent 62%, #e1c8cb 62%)' }}>{existingReview.cupon_codigo}</em>
                  </h2>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#192149' }}>Usalo en tu próxima compra de neceseres en theglowmarket.com.ar.</p>
                  <a href="/productos" style={{ background: '#24508a', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '18px 40px', borderRadius: 999 }}>
                    Ir al Market
                  </a>
                </div>
              ) : (
                <ReviewForm userId={user.id} />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
