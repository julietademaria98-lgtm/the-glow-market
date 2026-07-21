import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const response = NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'https://theglowmarket.com.ar')
  )
  response.cookies.delete('glow_session_token')
  return response
}
