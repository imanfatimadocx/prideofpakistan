'use client'

export default function Topbar() {
  const dateStr = new Date().toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center justify-between px-4 py-2 text-xs tracking-wide bg-green text-white/70 sm:px-8 lg:px-12 font-body">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span className="hidden font-medium text-gold-light sm:inline">{dateStr}</span>
        <span className="hidden opacity-40 sm:inline">|</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <a href="#" className="hidden transition-colors text-white/55 hover:text-gold-light md:inline">Contact</a>
        <a href="#" className="hidden transition-colors text-white/55 hover:text-gold-light md:inline">About</a>
        <a href="#" className="hidden transition-colors text-white/55 hover:text-gold-light md:inline">Our Mission</a>
      </div>
    </div>
  )
}