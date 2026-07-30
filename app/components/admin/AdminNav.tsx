'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/admin' },
  { label: 'Profiles',   href: '/admin/profiles' },
  { label: 'Businesses', href: '/admin/business' },
  { label: 'Stories',    href: '/admin/stories' },
  { label: 'Blog',       href: '/admin/blog' },
  { label: 'Media',      href: '/admin/media' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b lg:hidden bg-green border-white/10">
        <span className="text-sm font-bold text-white font-display">Admin Panel</span>
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, slide-in on mobile */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-green z-50 flex flex-col
        transition-transform duration-300
        lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-base font-bold text-white font-display">Pride of Pakistan</p>
          <p className="text-[11px] text-gold-light font-body mt-0.5 uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium font-body transition-colors no-underline ${
                pathname === href
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-body text-white/65 hover:bg-white/10 hover:text-white transition-colors no-underline mb-1"
          >
            View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-body text-white/65 hover:bg-white/10 hover:text-white transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}