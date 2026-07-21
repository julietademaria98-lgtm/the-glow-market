import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { post_id } = await request.json()

  const { data: existing } = await supabase.from('likes').select('id').eq('post_id', post_id).eq('user_id', user.id).single()

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id)
    return NextResponse.json({ liked: false })
  } else {
    await supabase.from('likes').insert({ post_id, user_id: user.id })
    return NextResponse.json({ liked: true })
  }
}
