'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: '' },
  { label: 'Profiles',  href: '/admin/profiles', icon: '' },
  { label: 'Business',  href: '/admin/business', icon: '' },
  { label: 'Stories',   href: '/admin/stories', icon: '' },
  { label: 'Media',     href: '/admin/media', icon: '' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 bottom-0 left-0 flex flex-col w-64 min-h-screen bg-green">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
            <span className="text-lg text-white">☽</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-white font-display">Pride of Pakistan</span>
            <span className="text-[10px] text-gold-light tracking-[.1em] uppercase font-semibold font-body">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(({ label, href, icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium font-body transition-colors ${
                isActive
                  ? 'bg-gold text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-5 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium font-body text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span className="text-base"></span>
          Sign Out
        </button>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium font-body text-white/40 hover:text-white/70 transition-colors mt-1"
        >
          <span className="text-base">←</span>
          Back to Site
        </Link>
      </div>
    </aside>
  )
}