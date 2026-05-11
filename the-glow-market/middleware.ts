import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

const PROTECTED_PATHS = ['/mi-curso']
const COMING_SOON_BYPASS = 'glow2025' // tu contraseña secreta para ver el sitio

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si visita /?preview=glow2025, guardar cookie y redirigir al inicio
  if (request.nextUrl.searchParams.get('preview') === COMING_SOON_BYPASS) {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('glow_preview', COMING_SOON_BYPASS, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  }

  // Rutas que siempre están disponibles
  const isPublic =
    pathname.startsWith('/coming-soon') ||
    pathname.startsWith('/api/suscribirse') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images')

  // Modo Coming Soon — bloquear si no tiene la cookie
  const hasPreview = request.cookies.get('glow_preview')?.value === COMING_SOON_BYPASS
  if (!isPublic && !hasPreview) {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|otf|ttf|woff|woff2)$).*)',
  ],
}
