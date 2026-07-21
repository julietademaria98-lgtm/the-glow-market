import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_PATHS = ['/mi-curso']
const ADMIN_EMAIL = 'julietademaria98@gmail.com'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const { supabaseResponse, user } = await updateSession(request)

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/admin') && (!user || user.email !== ADMIN_EMAIL)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
