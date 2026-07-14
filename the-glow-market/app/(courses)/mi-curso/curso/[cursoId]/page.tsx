import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
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
    <main className="min-h-screen bg-glow-cream">

      {/* Top nav */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-glow-cream/90 backdrop-blur-md border-b border-glow-navy/10 px-6 h-14 flex items-center">
        <Link
          href="/mi-curso"
          className="flex items-center gap-2 font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 hover:text-glow-navy/70 transition-colors"
        >
          <ChevronLeft size={14} />
          Mis Cursos
        </Link>
      </div>

      <div className="pt-14 max-w-[860px] mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="py-14 md:py-20 border-b border-glow-navy/10">
          <div className="flex items-center gap-2 mb-5">
            <StarIcon size={9} className="text-glow-blush" />
            <span className="font-montserrat text-[11px] tracking-[0.3em] uppercase text-glow-navy/60">
              Curso Online · Sponsored by Clarins
            </span>
          </div>
          <h1 className="font-cormorant text-6xl md:text-7xl lg:text-8xl text-glow-navy font-light tracking-wide leading-none mb-5">
            {curso.titulo}
          </h1>
          <p className="font-cormorant text-2xl text-glow-navy/50 italic mb-2">
            Pocos productos. Piel divina. Maquillaje que dura todo el día.
          </p>
          {curso.descripcion && (
            <p className="font-montserrat text-base text-glow-navy/50 leading-relaxed max-w-xl mt-4">
              {curso.descripcion}
            </p>
          )}

          <div className="flex items-center gap-4 mt-10 flex-wrap">
            {primeraLeccion && (
              <Link
                href={`/mi-curso/${primeraLeccion.id}`}
                className="flex items-center gap-3 bg-glow-navy text-white font-montserrat text-[10px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-glow-blush hover:text-glow-navy transition-colors duration-300"
              >
                <Play size={11} fill="currentColor" />
                Empezar curso
              </Link>
            )}
            <span className="font-montserrat text-[10px] text-glow-navy/30 tracking-wide">
              {lecciones.length} lecciones · ~25 min total
            </span>
          </div>
        </div>

        {/* Promesas */}
        <div className="grid grid-cols-4 border-b border-glow-navy/10">
          {[
            { label: 'de tu mañana', value: '~25 min' },
            { label: 'que cambia todo', value: 'Piel divina' },
            { label: 'en PDF para siempre', value: '5 guías' },
            { label: 'de por vida', value: 'Acceso ∞' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-8 text-center ${i < 3 ? 'border-r border-glow-navy/10' : ''}`}
            >
              <p className="font-cormorant text-2xl text-glow-navy font-light mb-1">{stat.value}</p>
              <p className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-glow-navy/30">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Módulos */}
        <div className="py-12 border-b border-glow-navy/10">
          <div className="flex items-center gap-3 mb-8">
            <StarIcon size={9} className="text-glow-blush" />
            <span className="font-montserrat text-[13px] tracking-[0.25em] uppercase text-glow-navy">
              Contenido del curso
            </span>
          </div>

          <div className="space-y-3">
            {modulos.map(([nombreModulo, leccionesModulo], mi) => (
              <div key={nombreModulo} className="border border-glow-navy/10">
                <div className="px-6 py-4 bg-glow-navy/[0.03] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-cormorant text-2xl font-light w-8" style={{ color: '#20699F' }}>
                      {String(mi + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-cormorant text-lg text-glow-navy font-light tracking-wide uppercase">
                      {nombreModulo}
                    </h3>
                  </div>
                  <span className="font-montserrat text-[9px] tracking-widest uppercase text-glow-navy/60">
                    {leccionesModulo.length} {leccionesModulo.length === 1 ? 'lección' : 'lecciones'}
                  </span>
                </div>

                <div className="divide-y divide-glow-navy/[0.05]">
                  {leccionesModulo.map((leccion) => (
                    <Link
                      key={leccion.id}
                      href={`/mi-curso/${leccion.id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-glow-navy/5 transition-colors duration-200 group"
                    >
                      <div className="w-7 h-7 rounded-full border border-glow-navy/30 flex items-center justify-center flex-shrink-0 group-hover:border-glow-blush group-hover:bg-glow-blush/10 transition-all duration-200">
                        <Play size={9} className="text-glow-navy/60 group-hover:text-glow-blush fill-current transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-montserrat text-xs text-glow-navy transition-colors">
                          {leccion.titulo}
                          {leccion.es_preview && (
                            <span className="ml-2 font-montserrat text-[9px] tracking-widest uppercase text-glow-blush/70">
                              · Preview
                            </span>
                          )}
                        </p>
                        {leccion.descripcion && (
                          <p className="font-montserrat text-[13px] text-glow-navy/60 mt-0.5 truncate pr-4">
                            {leccion.descripcion}
                          </p>
                        )}
                      </div>
                      {leccion.duracion && (
                        <span className="font-montserrat text-[10px] text-glow-navy/60 flex-shrink-0 tabular-nums">
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

        {/* Descargables */}
        <div className="py-12 border-b border-glow-navy/10">
          <div className="flex items-center gap-3 mb-8">
            <StarIcon size={9} className="text-glow-blush" />
            <span className="font-montserrat text-[13px] tracking-[0.25em] uppercase text-glow-navy">
              Material descargable
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { titulo: 'Kit Esencial', desc: 'Lista completa de productos Clarins con función y módulo' },
              { titulo: 'Diagnóstico de Piel', desc: 'Test de 6 preguntas para identificar tu tipo de piel' },
              { titulo: 'Guía de Subtono', desc: '3 tests caseros para elegir la base correcta' },
              { titulo: 'SOS Primer por Color', desc: 'Los 5 colores del SOS Primer y para qué sirve cada uno' },
              { titulo: 'Bronzer por Tipo de Cara', desc: 'Paso a paso visual según tu forma de rostro' },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border border-glow-navy/10">
                <span className="font-montserrat text-[9px] tracking-widest text-glow-navy/50 uppercase flex-shrink-0 mt-0.5">PDF</span>
                <div>
                  <p className="font-montserrat text-xs font-medium text-glow-navy mb-0.5">{d.titulo}</p>
                  <p className="font-montserrat text-[10px] text-glow-navy/60 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lo que incluye */}
        <div className="py-12 border-b border-glow-navy/10">
          <div className="flex items-center gap-3 mb-8">
            <StarIcon size={9} className="text-glow-blush" />
            <span className="font-montserrat text-[13px] tracking-[0.25em] uppercase text-glow-navy">
              Todo lo que llevás
            </span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '6 videos accesibles desde web y celular',
              '5 descargables exclusivos en PDF',
              'Acceso de por vida + actualizaciones futuras',
              'Links directos a productos Clarins con regalos por compra',
              'Acceso ilimitado, volvé a verlos cuando quieras',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check size={13} className="text-glow-navy mt-0.5 flex-shrink-0" />
                <span className="font-montserrat text-sm text-glow-navy">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA final */}
        <div className="py-14 text-center">
          {primeraLeccion && (
            <Link
              href={`/mi-curso/${primeraLeccion.id}`}
              className="inline-flex items-center gap-3 bg-glow-navy text-white font-montserrat text-[10px] tracking-[0.2em] uppercase px-10 py-4 hover:bg-glow-blush hover:text-glow-navy transition-colors duration-300"
            >
              <Play size={11} fill="currentColor" />
              Empezar ahora
            </Link>
          )}
          <p className="font-montserrat text-[10px] text-glow-navy tracking-wide mt-4">
            Acceso de por vida · Sponsored by Clarins
          </p>
        </div>

      </div>
    </main>
  )
}
