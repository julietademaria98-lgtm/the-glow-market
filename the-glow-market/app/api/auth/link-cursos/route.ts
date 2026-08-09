import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { linkPendingCourseOrders } from '@/lib/cursoAccess'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const activados = await linkPendingCourseOrders(user.email, user.id)

  return NextResponse.json({ activados })
}
