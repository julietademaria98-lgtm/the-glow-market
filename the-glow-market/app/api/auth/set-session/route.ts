import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const token = crypto.randomUUID()

  await supabase
    .from('sesiones_activas')
    .upsert({
      user_id: user.id,
      session_token: token,
      updated_at: new Date().toISOString(),
    })

  const response = NextResponse.json({ ok: true })
  response.cookies.set('glow_session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}
