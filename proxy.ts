import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const role = (token as { role?: string } | null)?.role

  // Admin routes - must have ADMIN role
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // Protected public routes - any logged-in user
  const protectedRoutes = [
    '/submit-profile',
    '/list-business',
    '/submit-city',
    '/your-stories/new',
    '/dashboard',
    '/membership',
  ]

  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/((?!login).*)',
    '/submit-profile',
    '/list-business',
    '/submit-city',
    '/your-stories/new',
    '/dashboard',
    '/membership',
  ],
}