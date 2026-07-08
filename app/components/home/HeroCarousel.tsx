import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden">
      <img
        src="bg-wallpaper.jpg"
        alt="Pakistan"
        className="absolute inset-0 object-cover object-center w-full h-full"
      />
      <div className="absolute inset-0 bg-green/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green/60" />

      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="max-w-[680px]">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] font-black text-white leading-[1.05] mb-5 -tracking-[.02em]">
              The Pride of Pakistan
            </h1>
            <p className="text-base sm:text-lg text-white/75 font-body leading-relaxed mb-8 max-w-[520px]">
              We honor the achievements of outstanding Pakistanis around the world, visionaries,
              entrepreneurs, innovators, and leaders whose talent, dedication, and integrity have
              made a lasting impact on their communities and beyond.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about-us"
                className="inline-flex items-center justify-center gap-2 bg-gold text-white px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors"
              >
                About Us →
              </Link>
              <Link
                href="/about-us"
                className="inline-flex items-center justify-center gap-2 bg-white/40 text-gold px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-white/60 hover:text-ink-dark transition-colors"
              >
                Our Mission →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}