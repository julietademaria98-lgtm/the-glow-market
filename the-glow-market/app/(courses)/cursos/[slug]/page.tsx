import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Curso } from '@/types'
import type { Metadata } from 'next'
import CourseLandingClient from '@/components/courses/CourseLandingClient'

async function getCurso(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cursos')
    .select('*, lecciones(*)')
    .eq('slug', slug)
    .eq('activo', true)
    .single()
  return data as Curso | null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const curso = await getCurso(params.slug)
  if (!curso) return { title: 'Curso no encontrado' }

  const descripcion =
    curso.descripcion ||
    `Curso online de automaquillaje ${curso.titulo}, con el respaldo de Clarins.`

  return {
    title: `${curso.titulo} — Curso Online de Maquillaje — The Glow Market`,
    description: descripcion,
    keywords: ['cursos online', 'curso de maquillaje', 'automaquillaje', curso.titulo, 'clarins', 'argentina'],
    openGraph: {
      title: `${curso.titulo} — Curso Online de Maquillaje`,
      description: descripcion,
      images: curso.imagen_url ? [curso.imagen_url] : undefined,
    },
  }
}

export default async function CursoLandingPage({ params }: { params: { slug: string } }) {
  const curso = await getCurso(params.slug)
  if (!curso) notFound()
  return <CourseLandingClient curso={curso} />
}
