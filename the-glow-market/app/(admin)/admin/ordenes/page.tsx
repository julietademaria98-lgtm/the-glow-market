import { createClient } from '@supabase/supabase-js'
import OrdenesClient from './OrdenesClient'

async function getOrdenes() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const [{ data: ordenes }, { data: authData }] = await Promise.all([
    db.from('ordenes').select('*').order('created_at', { ascending: false }).limit(100),
    db.auth.admin.listUsers(),
  ])
  const users = authData?.users || []
  return (ordenes || []).map((o: any) => ({
    ...o,
    userEmail: users.find((u: any) => u.id === o.user_id)?.email || null,
  }))
}

export default async function AdminOrdenesPage() {
  const ordenes = await getOrdenes()
  return <OrdenesClient ordenes={ordenes} />
}
