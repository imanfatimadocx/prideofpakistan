'use client'

export default function Topbar() {
  const dateStr = new Date().toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center justify-between px-4 py-2 text-xs tracking-wide bg-gold-light text-white/70 sm:px-8 lg:px-12 font-body">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span className="hidden font-bold text-green sm:inline">{dateStr}</span>
        <span className="hidden sm:inline text-green">|</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <a href="./contact" className="hidden font-bold transition-colors text-green hover:text-black md:inline">Contact</a>
        <a href="./about" className="hidden font-bold transition-colors text-green hover:text-black md:inline">About</a>
        <a href="./mission" className="hidden font-bold transition-colors text-green hover:text-black md:inline">Our Mission</a>
      </div>
    </div>
  )
}