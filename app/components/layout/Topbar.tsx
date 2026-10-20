'use client'

export default function Topbar() {
  const dateStr = new Date().toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="py-2 text-xs tracking-wide bg-slate-deep text-white font-body">
      <div className="flex items-center justify-between max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span className="hidden font-bold text-white sm:inline">{dateStr}</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <a href="/contact" className="hidden font-bold transition-colors text-white hover:text-sage md:inline">Contact Us</a>
        <a href="/about" className="hidden font-bold transition-colors text-white hover:text-sage md:inline">About Us</a>
        <a href="/mission" className="hidden font-bold transition-colors text-white hover:text-sage md:inline">Our Mission</a>
      </div>
      </div>
    </div>
  )
}