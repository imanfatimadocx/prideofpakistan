'use client'
import { useState } from 'react'
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

  return (
    <nav className="bg-white border-b-[2.5px] border-gold sticky top-0 z-[100] shadow-[0_2px_24px_rgba(13,74,46,0.07)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between h-16 lg:h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 my-4">
              <Image
                src="/logo-bg.png"
                alt="Pride of Pakistan"
                className="object-contain"
                width={260}
                height={260}
              />
            </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-[13px] font-medium px-3 py-2 rounded-md transition-all whitespace-nowrap font-body ${
                pathname === href ? 'text-green font-semibold' : 'text-ink-mid hover:text-green hover:bg-green/5'
              }`}
            >
              {label}
            </Link>
          ))}

          {session ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-ink-muted font-body">
                {session.user?.name ?? session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-[13px] font-medium px-3 py-2 rounded-md text-ink-mid hover:text-green hover:bg-green/5 font-body"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/login" className="text-[13px] font-medium px-3 py-2 rounded-md text-ink-mid hover:text-green hover:bg-green/5 font-body">
                Sign In
              </Link>
              <Link href="/register" className="bg-gold text-white rounded-md px-4 py-2.5 font-semibold text-[13px] hover:bg-gold-light hover:text-ink-dark transition-colors">
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-green transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-green transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-green transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[520px]' : 'max-h-0'}`}>
        <div className="flex flex-col gap-1 px-4 pb-4 border-t sm:px-8 border-border">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium px-3 py-2.5 rounded-md font-body ${
                pathname === href ? 'text-green font-semibold bg-green/5' : 'text-ink-mid'
              }`}
            >
              {label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm font-medium px-3 py-2.5 rounded-md font-body text-ink-mid text-left"
            >
              Sign Out ({session.user?.name})
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium px-3 py-2.5 rounded-md font-body text-ink-mid">Sign In</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="bg-gold text-white rounded-md px-4 py-2.5 font-semibold text-sm text-center mt-1">Join Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}