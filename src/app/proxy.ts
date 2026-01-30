import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/users']
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password']

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const hasSession = request.cookies.has('refresh_token')

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  // TODO: think about it
  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL('/users', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.svg$).*)',
  ],
}
