export const dynamic = 'force-dynamic'

import { catalogData } from '@/lib/catalog-result'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Curso } from '@/types'
import CourseLandingClient from '@/components/courses/CourseLandingClient'

async function getCurso(slug: string) {
  const supabase = await createClient()
  const result = await supabase
    .from('cursos')
    .select('*, lecciones(*)')
    .eq('slug', slug)
    .eq('activo', true)
    .maybeSingle()
  return catalogData(result, 'curso') as Curso | null
}

export default async function CursoLandingPage({ params }: { params: { slug: string } }) {
  const curso = await getCurso(params.slug)
  if (!curso) notFound()
  return <CourseLandingClient curso={curso} />
}
