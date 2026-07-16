import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    const role = (token as { role?: string })?.role

    // Admin routes — must have ADMIN role
    if (pathname.startsWith('/admin')) {
      if (!token || role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    // Public protected routes — any logged-in user
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
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)

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