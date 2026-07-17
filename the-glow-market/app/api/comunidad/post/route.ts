import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { contenido } = await request.json()
  if (!contenido?.trim()) return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 })

  const { data, error } = await supabase.from('posts').insert({ user_id: user.id, contenido }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ post: data })
}
