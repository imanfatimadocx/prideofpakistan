'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export interface HeroSlide {
  id: number
  name: string
  title: string
  desc: string
  label: string
  image: string
  urdu: string
  city?: string | null
}

interface Props {
  slides: HeroSlide[]
}

export default function HeroCarousel({ slides }: Props) {
  const [cur, setCur] = useState(0)
  const total = slides.length

  const goTo = useCallback((n: number) => {
    setCur(((n % total) + total) % total)
  }, [total])

  useEffect(() => {
    const t = setInterval(() => goTo(cur + 1), 6000)
    return () => clearInterval(t)
  }, [cur, goTo])

  if (!slides.length) return null

  return (
    <section className="relative h-[420px] sm:h-[480px] lg:h-[560px] overflow-hidden bg-green">
      {/* Slides track */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.77,0,.175,1)]"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {slides.map((s) => (
          <div key={s.id} className="min-w-full h-full relative flex items-center">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-top brightness-[.38]"
              style={{ backgroundImage: `url('${s.image}')` }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green/95 via-green/65 to-green/10" />

            {/* Urdu watermark — hidden on mobile */}
            <span className="hidden sm:block font-urdu text-xl lg:text-2xl text-white/[.18] absolute right-8 lg:right-[72px] top-8 lg:top-11 z-[2] [direction:rtl] pointer-events-none">
              {s.urdu}
            </span>

            {/* Content */}
            <div className="hero-content relative z-[2] px-5 sm:px-12 lg:px-24 max-w-[90%] sm:max-w-[480px] lg:max-w-[640px]">
              <span className="inline-block bg-gold text-white text-[10px] font-bold tracking-[.12em] uppercase px-3.5 py-1.5 rounded mb-3 sm:mb-4 font-body">
                {s.label}
              </span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.02] mb-2 -tracking-[.02em]">
                {s.name}
              </h1>
              <p className="text-sm sm:text-base text-white/70 mb-1.5 font-light font-body">
                {s.title}
              </p>
              {s.city && (
                <p className="text-xs sm:text-[13px] text-gold-light mb-3 sm:mb-3.5 font-medium font-body">
                  📍 {s.city}
                </p>
              )}
              <p className="text-xs sm:text-sm text-white/60 leading-[1.75] max-w-[460px] mb-6 sm:mb-8 font-body line-clamp-3 sm:line-clamp-none">
                {s.desc}
              </p>
              <Link
                href={`/who-is-who/${s.id}`}
                className="inline-flex items-center gap-2.5 bg-gold text-white px-5 sm:px-6.5 py-3 sm:py-3.5 rounded-md font-semibold text-sm transition-all hover:bg-gold-light hover:text-ink-dark hover:translate-x-1 font-body tracking-[.01em]"
              >
                Read Full Profile <span>→</span>
              </Link>
            </div>

            {/* Decorative frame corner — desktop only */}
            <div className="hidden lg:block absolute right-[72px] bottom-12 w-[180px] h-[180px] border-r-2 border-b-2 border-gold/25 rounded-br-md pointer-events-none z-[1]" />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-12 lg:left-24 z-10 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-[3px] rounded transition-all duration-300 ${
              i === cur ? 'bg-gold w-10 sm:w-[52px]' : 'bg-white/30 w-6 sm:w-7'
            }`}
          />
        ))}
      </div>

      {/* Arrows — hidden on small mobile */}
      <div className="hidden sm:flex absolute right-6 lg:right-12 bottom-5 lg:bottom-6 z-10 gap-2">
        <button
          onClick={() => goTo(cur - 1)}
          aria-label="Previous"
          className="w-10 h-10 lg:w-[42px] lg:h-[42px] bg-white/[.08] border border-white/[.18] text-white rounded-full flex items-center justify-center transition-all text-base hover:bg-gold hover:border-gold font-body"
        >
          ←
        </button>
        <button
          onClick={() => goTo(cur + 1)}
          aria-label="Next"
          className="w-10 h-10 lg:w-[42px] lg:h-[42px] bg-white/[.08] border border-white/[.18] text-white rounded-full flex items-center justify-center transition-all text-base hover:bg-gold hover:border-gold font-body"
        >
          →
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-10">
        <div
          key={cur}
          className="h-full bg-gold animate-progress origin-left"
          style={{ animationDuration: '6s' }}
        />
      </div>
    </section>
  )
}