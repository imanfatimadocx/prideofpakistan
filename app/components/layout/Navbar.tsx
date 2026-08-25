'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const NAV = [
  { label: 'Home',               href: '/' },
  { label: 'Who Is Who',         href: '/who-is-who' },
  { label: 'Pakistani Products', href: '/products' },
  { label: 'Your Stories',       href: '/your-stories' },
  { label: 'Pakistani Businesses', href: '/business' },
  { label: 'Pride TV',           href: '/pride-tv' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav className="bg-green border-b-[2.5px] border-gold sticky top-0 z-[100] shadow-[0_2px_24px_rgba(13,74,46,0.07)]">
        <div className="flex items-center justify-between h-20 max-w-full px-4 mx-auto sm:px-8 lg:px-16 lg:h-28">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/final-logo-1.png"
              alt="Pride of Pakistan"
              className="object-contain w-auto h-10 lg:h-24"
              width={460}
              height={460}
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-[13px] font-bold px-3 py-2 rounded-md transition-all whitespace-nowrap font-body ${
                  pathname === href
                    ? 'text-gold font-semibold'
                    : 'text-white hover:text-gold hover:bg-gold/5'
                }`}
              >
                {label}
              </Link>
            ))}
            {session ? (
              <div className="flex items-center gap-2 ml-3">
                <Link
                  href="/dashboard"
                  className={`text-[13px] font-bold px-3 py-2 rounded-md transition-all font-body ${
                    pathname === '/dashboard'
                      ? 'text-gold font-semibold'
                      : 'text-white hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-[13px] font-bold px-3 py-2 rounded-md text-white hover:text-gold hover:bg-gold/5 font-body transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3">
                <Link
                  href="/login"
                  className="text-[13px] font-bold px-3 py-2 rounded-md text-white hover:text-gold hover:bg-gold/5 font-body transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gold text-white rounded-md px-4 py-2.5 font-bold text-[13px] hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile — right side: auth shortcut + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            {session ? (
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-white font-body border border-white/30 px-3 py-1.5 rounded-full hover:border-gold hover:text-gold transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-white font-body border border-white/30 px-3 py-1.5 rounded-full hover:border-gold hover:text-gold transition-colors"
              >
                Sign In
              </Link>
            )}
            {/* Hamburger — white lines, visible on green */}
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[200] lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer — green to match navbar */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-green z-[210] lg:hidden shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(.77,0,.175,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between flex-shrink-0 px-5 py-4 border-b border-white/10">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/final-logo-1.png"
              alt="Pride of Pakistan"
              className="object-contain w-auto h-12"
              width={240}
              height={240}
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center text-white transition-colors rounded-full w-9 h-9 hover:bg-white/10"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium font-body transition-colors ${
                  pathname === href
                    ? 'bg-white/10 text-gold font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
                {pathname === href && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                )}
              </Link>
            ))}
            {session && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium font-body transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-white/10 text-gold font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                My Dashboard
                {pathname === '/dashboard' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                )}
              </Link>
            )}
          </div>
        </div>

        {/* Drawer footer — auth */}
        <div className="flex-shrink-0 px-4 py-5 border-t border-white/10">
          {session ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3">
                <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-gold font-display">
                  {(session.user?.name ?? session.user?.email ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate font-body">
                    {session.user?.name ?? session.user?.email}
                  </p>
                  <p className="text-xs truncate text-white/60 font-body">{session.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full py-2 text-sm font-semibold text-center transition-colors rounded-lg text-white/60 font-body hover:bg-white/10 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="w-full py-3 text-sm font-semibold text-center text-white no-underline transition-colors rounded-lg bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full py-3 text-sm font-semibold text-center text-white no-underline transition-colors border rounded-lg border-white/20 font-body hover:border-gold hover:text-gold"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}