'use client'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Home',               href: '/' },
  { label: 'Who Is Who',         href: '/who-is-who' },
  { label: 'Pakistani Products', href: '/products' },
  { label: 'Cities',             href: '/cities' },
  { label: 'Pride Blog',         href: '/pride-blog' },
  { label: 'Business Directory', href: '/business' },
  { label: 'Pride TV',           href: '/pride-tv' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b-[2.5px] border-gold sticky top-0 z-[100] shadow-[0_2px_24px_rgba(13,74,46,0.07)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0" onClick={() => setOpen(false)}>
  <Image
    src="/logo5.png"
    alt="Pride of Pakistan"
    className="flex-shrink-0 object-cover"
    width={180}
    height={180}
  />
  <div className="flex flex-col leading-tight">
    <span className="font-display text-base lg:text-lg font-bold text-green -tracking-[0.01em]">
      Pride of Pakistan
    </span>
    <span className="text-[9px] lg:text-[10px] text-gold tracking-[.14em] uppercase font-semibold font-body">
      Celebrating Our Nation
    </span>
  </div>
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
          <Link
            href="/submit-profile"
            className="bg-gold text-white rounded-md px-6 py-2.5 font-semibold text-[13px] ml-1.5 hover:bg-gold-light hover:text-ink-dark transition-colors"
          >
            Submit Profile
          </Link>
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
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[480px]' : 'max-h-0'}`}>
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
          <Link
            href="/submit-profile"
            onClick={() => setOpen(false)}
            className="bg-gold text-white rounded-md px-8 py-2.5 font-semibold text-sm text-center mt-1"
          >
            Submit Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}