'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin' },
    ],
  },
  {
    label: 'Hall of Fame',
    items: [
      { label: 'Manage Profiles', href: '/admin/profiles' },
      { label: 'Add Profile',     href: '/admin/profiles/new' },
      { label: 'Categories',      href: '/admin/categories' },
    ],
  },
  {
    label: 'Business Directory',
    items: [
      { label: 'Manage Businesses', href: '/admin/business' },
    ],
  },
  {
    label: 'Stories & Blog',
    items: [
      { label: 'Manage Stories', href: '/admin/stories' },
      { label: 'Blog Posts',     href: '/admin/blog' },
    ],
  },
  {
    label: 'Pride TV',
    items: [
      { label: 'Manage Videos', href: '/admin/media' },
    ],
  },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-green border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-display text-sm font-bold text-white">Admin Panel</span>
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
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-green z-50 flex flex-col
        transition-transform duration-300
        lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex-shrink-0">
          <p className="font-display text-base font-bold text-white">Pride of Pakistan</p>
          <p className="text-[11px] text-gold-light font-body mt-0.5 uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-1">
              {/* Group label */}
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[.16em] text-white/35 font-body">
                {group.label}
              </p>
              {/* Group items */}
              {group.items.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-lg mx-2 text-sm font-medium font-body transition-colors no-underline ${
                    pathname === href
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/65 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-body text-white/65 hover:bg-white/10 hover:text-white transition-colors no-underline mb-1"
          >
            ← View Site
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