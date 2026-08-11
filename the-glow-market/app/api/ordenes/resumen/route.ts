import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const adminClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get('order')
  if (!orderId) {
    return NextResponse.json({ error: 'Falta el parámetro order' }, { status: 400 })
  }

  const { data: orden } = await adminClient
    .from('ordenes')
    .select('items, total, estado')
    .eq('id', orderId)
    .single()

  if (!orden) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  const cursosIds = new Set(
    (await adminClient.from('cursos').select('id')).data?.map((c: any) => c.id) || []
  )
  const items: { id: string }[] = orden.items || []
  const hasCurso = items.some((item) => cursosIds.has(item.id))
  const hasProductoFisico = items.some((item) => !cursosIds.has(item.id))

  return NextResponse.json({
    hasCurso,
    hasProductoFisico,
    total: orden.total || 0,
    aprobado: orden.estado === 'aprobado',
  })
}
