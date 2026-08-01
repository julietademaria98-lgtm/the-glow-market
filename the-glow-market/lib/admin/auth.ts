import { createClient as createServiceClient, type SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from './email'

export { ADMIN_EMAIL }

export function getAdminClient(): SupabaseClient {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function checkAdmin(): Promise<SupabaseClient> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) throw new Error('No autorizado')
  return getAdminClient()
}

export type AdminGuard =
  | { ok: true; db: SupabaseClient }
  | { ok: false; response: NextResponse }

export async function getAdminOr401(): Promise<AdminGuard> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    }
  }
  return { ok: true, db: getAdminClient() }
}
