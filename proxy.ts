import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

/**
 * Paths that require an authenticated user.
 * Unauthenticated requests to these paths are redirected to /login.
 */
const PROTECTED_PATHS = ['/dashboard', '/instructor', '/admin', '/learn']

/**
 * Next.js Proxy — runs on every matched request.
 * (Next.js 16 renamed 'middleware' to 'proxy'.)
 *
 * Responsibilities:
 * 1. Refresh the Supabase auth session (cookie management).
 * 2. Redirect unauthenticated visitors away from protected routes.
 *
 * @param request - The incoming Next.js request
 * @returns The response with refreshed auth cookies, or a redirect.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)

  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
