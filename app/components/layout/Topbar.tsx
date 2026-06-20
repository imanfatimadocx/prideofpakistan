'use client'

export default function Topbar() {
  const dateStr = new Date().toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-green text-white/70 text-xs px-4 sm:px-8 lg:px-12 py-2 flex justify-between items-center tracking-wide font-body">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span className="text-gold-light font-medium hidden sm:inline">{dateStr}</span>
        <span className="opacity-40 hidden sm:inline">|</span>
        <span className="text-[11px] sm:text-xs">Islamabad, Pakistan</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <a href="#" className="text-white/55 hover:text-gold-light transition-colors hidden sm:inline">اردو</a>
        <a href="#" className="text-white/55 hover:text-gold-light transition-colors hidden md:inline">Contact</a>
        <a href="#" className="text-white/55 hover:text-gold-light transition-colors hidden md:inline">About</a>
        <a
          href="/submit-profile"
          className="bg-gold text-white px-3 py-1 rounded font-semibold text-[11px] sm:text-xs hover:bg-gold-light hover:text-ink-dark transition-colors"
        >
          Submit Profile
        </a>
      </div>
    </div>
  )
}