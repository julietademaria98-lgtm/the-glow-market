import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

const PROTECTED_PATHS = ['/mi-curso']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseResponse, user } = await updateSession(request)

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isProtected && user) {
    const cookieToken = request.cookies.get('glow_session_token')?.value

    if (!cookieToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('kicked', 'true')
      return NextResponse.redirect(loginUrl)
    }

    const supabase = await createClient()
    const { data } = await supabase
      .from('sesiones_activas')
      .select('session_token')
      .eq('user_id', user.id)
      .single()

    if (!data || data.session_token !== cookieToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('kicked', 'true')
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('glow_session_token')
      return response
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
