import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Curso } from '@/types'
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

export default async function CursoLandingPage({ params }: { params: { slug: string } }) {
  const curso = await getCurso(params.slug)
  if (!curso) notFound()
  return <CourseLandingClient curso={curso} />
}
