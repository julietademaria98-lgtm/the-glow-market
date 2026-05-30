import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Check, ChevronLeft } from 'lucide-react'
import StarIcon from '@/components/ui/StarIcon'
import type { Curso, Leccion } from '@/types'

interface Props {
  params: { cursoId: string }
}

async function getCourseData(cursoId: string, userId: string) {
  const supabase = await createClient()

  const { data: acceso } = await supabase
    .from('accesos_curso')
    .select('id')
    .eq('user_id', userId)
    .eq('curso_id', cursoId)
    .eq('activo', true)
    .single()

  if (!acceso) return null

  const { data: curso } = await supabase
    .from('cursos')
    .select('*, lecciones(*)')
    .eq('id', cursoId)
    .eq('activo', true)
    .single()

  return curso as (Curso & { lecciones: Leccion[] }) | null
}

export default async function CourseOverviewPage({ params }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?redirect=/mi-curso/curso/${params.cursoId}`)

  const curso = await getCourseData(params.cursoId, user.id)
  if (!curso) notFound()

  const lecciones = (curso.lecciones || []).sort((a, b) => a.orden - b.orden)
  const primeraLeccion = lecciones[0]

  const modulosMap = new Map<string, Leccion[]>()
  lecciones.forEach((l) => {
    const key = l.modulo || 'Módulo 1'
    if (!modulosMap.has(key)) modulosMap.set(key, [])
    modulosMap.get(key)!.push(l)
  })
  const modulos = Array.from(modulosMap.entries())

  return (
    <main className="min-h-screen bg-glow-dark">
      <div className="fixed top-0 left-0 right-0 z-10 bg-glow-dark/80 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center">
        <Link
          href="/mi-curso"
          className="flex items-center gap-2 font-montserrat text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white/70 transition-colors"
        >
          <ChevronLeft size={14} />
          Mis Cursos
        </Link>
      </div>

      <div className="pt-14">
        <div className="relative h-[340px] md:h-[420px] overflow-hidden">
          <Image
            src={curso.imagen_url || '/placeholder-course.jpg'}
            alt={curso.titulo}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-glow-dark via-glow-dark/60 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10">
            <div className="max-w-[900px]">
              <div className="flex items-center gap-2 mb-3">
                <StarIcon size={9} className="text-glow-blush" />
                <span className="font-montserrat text-[9px] tracking-[0.25em] uppercase text-glow-blush">
                  Curso Online · En alianza con Clarins
                </span>
              </div>
              <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-white font-light tracking-wide leading-tight mb-3">
                {curso.titulo}
              </h1>
              {curso.descripcion && (
                <p className="font-montserrat text-sm text-white/60 max-w-xl leading-relaxed mb-6">
                  {curso.descripcion}
                </p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                {primeraLeccion && (
                  <Link
                    href={`/mi-curso/${primeraLeccion.id}`}
                    className="flex items-center gap-3 bg-glow-blush text-glow-navy font-montserrat text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-white transition-colors duration-300"
                  >
                    <Play size={12} fill="currentColor" />
                    Empezar curso
                  </Link>
                )}
                <span className="font-montserrat text-[10px] text-white/40 tracking-wide">
                  {lecciones.length} {lecciones.length === 1 ? 'lección' : 'lecciones'} · ~25 min
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-6 md:px-12 py-12">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { label: 'Módulos', value: String(modulos.length) },
              { label: 'Lecciones', value: String(lecciones.length) },
              { label: 'Descargables', value: '5 PDFs' },
              { label: 'Acceso', value: 'De por vida' },
            ].map((stat) => (
              <div key={stat.label} className="border border-white/10 p-4">
                <p className="font-cormorant text-2xl text-white font-light mb-1">{stat.value}</p>
                <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-8">
              <StarIcon size={9} className="text-glow-blush" />
              <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase text-white/40">
                Contenido del curso
              </span>
            </div>

            <div className="space-y-4">
              {modulos.map(([nombreModulo, leccionesModulo], mi) => (
                <div key={nombreModulo} className="border border-white/10">
                  <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-cormorant text-2xl text-glow-blush/60 font-light">
                        {String(mi + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-cormorant text-lg text-white font-light">
                        {nombreModulo}
                      </h3>
                    </div>
                    <span className="font-montserrat text-[9px] tracking-widest uppercase text-white/30">
                      {leccionesModulo.length} {leccionesModulo.length === 1 ? 'lección' : 'lecciones'}
                    </span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {leccionesModulo.map((leccion) => (
                      <Link
                        key={leccion.id}
                        href={`/mi-curso/${leccion.id}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors duration-200 group"
                      >
                        <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:border-glow-blush group-hover:bg-glow-blush/10 transition-all duration-200">
                          <Play size={10} className="text-white/40 group-hover:text-glow-blush fill-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-montserrat text-xs text-white/70 group-hover:text-white transition-colors truncate">
                            {leccion.titulo}
                          </p>
                          {leccion.descripcion && (
                            <p className="font-montserrat text-[10px] text-white/30 mt-0.5 truncate">
                              {leccion.descripcion}
                            </p>
                          )}
                        </div>
                        {leccion.duracion && (
                          <span className="font-montserrat text-[10px] text-white/30 flex-shrink-0">
                            {leccion.duracion}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 border border-white/10 p-6">
            <h3 className="font-cormorant text-2xl text-white font-light mb-6">
              Descargables incluidos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Kit Esencial — lista completa de productos',
                'Diagnóstico de Piel — test de 6 preguntas',
                'Guía de Subtono — elegí tu base correcta',
                'SOS Primer por Color — los 5 colores explicados',
                'Bronzer por Tipo de Cara — 6 tipos con diagramas',
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check size={12} className="text-glow-blush flex-shrink-0" />
                  <span className="font-montserrat text-xs text-white/60">{d}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
