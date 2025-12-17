import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (pathname.endsWith('/admin') && pathname !== '/admin') {
    const returnPath = pathname.replace(/\/admin$/, '') || '/'
    const url = new URL('/admin', request.url)
    url.searchParams.set('returnTo', returnPath)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}