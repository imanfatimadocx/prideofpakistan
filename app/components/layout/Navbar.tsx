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
  { label: 'Cities',             href: '/cities' },
  { label: 'Your Stories',       href: '/your-stories' },
  { label: 'Business Directory', href: '/business' },
  { label: 'Pride TV',           href: '/pride-tv' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav className="bg-white border-b-[2.5px] border-gold sticky top-0 z-[100] shadow-[0_2px_24px_rgba(13,74,46,0.07)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between h-16 lg:h-28">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo-bg.png"
              alt="Pride of Pakistan"
              className="object-contain w-auto h-10 lg:h-36"
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
                className={`text-[13px] font-medium px-3 py-2 rounded-md transition-all whitespace-nowrap font-body ${
                  pathname === href
                    ? 'text-green font-semibold'
                    : 'text-ink-mid hover:text-green hover:bg-green/5'
                }`}
              >
                {label}
              </Link>
            ))}

            {session ? (
              <div className="flex items-center gap-2 ml-3">
                <Link
                  href="/dashboard"
                  className={`text-[13px] font-medium px-3 py-2 rounded-md transition-all font-body ${
                    pathname === '/dashboard'
                      ? 'text-green font-semibold'
                      : 'text-ink-mid hover:text-green hover:bg-green/5'
                  }`}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-[13px] font-medium px-3 py-2 rounded-md text-ink-mid hover:text-green hover:bg-green/5 font-body transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3">
                <Link
                  href="/login"
                  className="text-[13px] font-medium px-3 py-2 rounded-md text-ink-mid hover:text-green hover:bg-green/5 font-body transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gold text-white rounded-md px-4 py-2.5 font-semibold text-[13px] hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile — right side: auth shortcut + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {session ? (
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-green font-body border border-green/20 px-3 py-1.5 rounded-full"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-gold font-body border border-gold/30 px-3 py-1.5 rounded-full"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-green transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-green transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-green transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — slides in from right */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[200] lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-[210] lg:hidden shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(.77,0,.175,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between flex-shrink-0 px-5 py-4 border-b border-border">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/logo-bg.png"
              alt="Pride of Pakistan"
              className="object-contain w-auto h-8"
              width={120}
              height={120}
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center transition-colors rounded-full w-9 h-9 hover:bg-cream text-ink-muted"
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
                    ? 'bg-green/5 text-green font-semibold'
                    : 'text-ink-mid hover:bg-cream hover:text-green'
                }`}
              >
                {label}
                {pathname === href && <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />}
              </Link>
            ))}

            {session && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium font-body transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-green/5 text-green font-semibold'
                    : 'text-ink-mid hover:bg-cream hover:text-green'
                }`}
              >
                My Dashboard
                {pathname === '/dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />}
              </Link>
            )}
          </div>
        </div>

        {/* Drawer footer — auth */}
        <div className="flex-shrink-0 px-4 py-5 border-t border-border bg-cream">
          {session ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3">
                <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-green font-display">
                  {(session.user?.name ?? session.user?.email ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-ink-dark font-body">
                    {session.user?.name ?? session.user?.email}
                  </p>
                  <p className="text-xs truncate text-ink-muted font-body">{session.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full py-2 text-sm font-semibold text-center transition-colors rounded-lg text-ink-muted font-body hover:bg-white hover:text-red-600"
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
                className="w-full py-3 text-sm font-semibold text-center no-underline transition-colors border rounded-lg border-border text-ink-mid font-body hover:border-gold hover:text-green"
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