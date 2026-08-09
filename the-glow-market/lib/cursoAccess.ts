import { createClient as createServiceClient } from '@supabase/supabase-js'

function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Busca órdenes de cursos aprobadas sin usuario vinculado que coincidan con este email
 * (compradas como invitada) y activa el acceso al curso para la cuenta recién logueada.
 */
export async function linkPendingCourseOrders(
  email: string | null | undefined,
  userId: string
): Promise<number> {
  if (!email) return 0
  const db = adminClient()
  const emailNormalizado = email.trim()

  const { data: cursos } = await db.from('cursos').select('id')
  const cursoIds = new Set((cursos || []).map((c: { id: string }) => c.id))
  if (cursoIds.size === 0) return 0

  const { data: ordenes } = await db
    .from('ordenes')
    .select('id, items')
    .is('user_id', null)
    .eq('estado', 'aprobado')
    .ilike('datos_envio->>email', emailNormalizado)

  if (!ordenes || ordenes.length === 0) return 0

  let activados = 0

  for (const orden of ordenes) {
    const cursoItems = (orden.items || []).filter((item: { id: string }) => cursoIds.has(item.id))
    if (cursoItems.length === 0) continue

    await db.from('ordenes').update({ user_id: userId }).eq('id', orden.id)

    for (const item of cursoItems) {
      await db
        .from('accesos_curso')
        .upsert(
          { user_id: userId, curso_id: item.id, activo: true },
          { onConflict: 'user_id,curso_id' }
        )
      activados++
    }
  }

  return activados
}
