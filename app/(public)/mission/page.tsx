import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import Link from 'next/link'

const MISSION_IMAGES = [
  '/mission-bg.jpg',
  '/mission-2.jfif',
  '/mission-3.jpg',
]

const PILLARS = [
  { icon: '', title: 'Global Representation', desc: 'Highlighting Pakistanis who have made their mark across the world — in business, arts, science, sport, and public service.' },
  { icon: '', title: 'Unity & Understanding', desc: 'Building bridges between Pakistan, its diaspora, and the international community through shared stories of achievement.' },
  { icon: '', title: 'Challenging Misconceptions', desc: 'Countering negative narratives about Pakistan with real, verifiable stories of progress, talent, and contribution.' },
  { icon: '', title: 'National Pride', desc: 'Fostering a sense of pride in Pakistani identity — one rooted in diversity, resilience, hospitality, and hard work.' },
]

export default function MissionPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        {/* Full-bleed hero */}
        <section className="relative flex items-center overflow-hidden min-h-240 sm:min-h-[480px] lg:min-h-[800px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MISSION_IMAGES[0]}
            alt="Our Mission"
            className="absolute inset-0 object-cover w-full h-full object-fit"
          />
          <div className="absolute inset-0 bg-green/60" />
          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-20">
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-4 font-body">
              Our Mission
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-tight max-w-3xl mb-6 -tracking-[.02em]">
              Celebrating the Very Best Pakistan Has Given the World
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/75 font-body sm:text-lg">
              Pride is a term which we should cherish. Pride in the achievements of a people, their actions, and their views — when those activities are enhancing and benefiting the world.
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 bg-white sm:py-20 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

            {/* Section 1 — text left, image right */}
            <div className="grid items-center grid-cols-1 gap-12 mb-20 lg:grid-cols-2 lg:gap-20 lg:mb-28">
              <div className="space-y-5">
                <h2 className="text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
                  Recognising Achievement Across the Globe
                </h2>
                <div className="w-12 h-[3px] bg-gold rounded" />
                <p className="text-base leading-relaxed text-ink-mid font-body">
                  Pride of Pakistan seeks to highlight those individuals who have become celebrated in their respective fields and made successes of them across the globe. Having pride in such achievements is worthwhile — it is a useful way of celebrating the many good, law-abiding, talented, and hard-working individuals who have taken what it means to be a Pakistani and shown the world the best parts of what Pakistan stands for.
                </p>
                <p className="text-base leading-relaxed text-ink-mid font-body">
                  We want to highlight and recognize these individuals so that others can see the diverse range of abilities and characters that have gone to represent Pakistan. We want to emphasize those who have done well, have established businesses for themselves and others, and have created wealth and developed enterprise wherever they are.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MISSION_IMAGES[1]}
                  alt="Pakistani achievements"
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"

                />
              </div>
            </div>

            {/* Section 2 — image left, text right */}
            <div className="grid items-center grid-cols-1 gap-12 mb-20 lg:grid-cols-2 lg:gap-20 lg:mb-28">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-cream lg:order-1 order-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MISSION_IMAGES[2]}
                  alt="Building communities"
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="order-1 space-y-5 lg:order-2">
                <h2 className="text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
                  Not Self-Promotion — Genuine Recognition
                </h2>
                <div className="w-12 h-[3px] bg-gold rounded" />
                <p className="text-base leading-relaxed text-ink-mid font-body">
                  This is not about meaningless self-promotion but about highlighting the very best that Pakistanis have given the world and showing a positive side to what we do, and what we give to the communities in which we settle.
                </p>
                <p className="text-base leading-relaxed text-ink-mid font-body">
                  This website is intended to reflect these developments by highlighting the achievements of those individuals who have enhanced life wherever they are through their work, their actions and their lives. These are the people who are proud of what they have done — and we, in highlighting what they have done, are proud of them.
                </p>
                <blockquote className="py-2 pl-5 border-l-4 border-gold">
                  <p className="text-lg leading-snug font-display text-green">
                    "We want to ensure their activities are recognized."
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Four pillars */}
        <section className="py-16 bg-cream sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-3 font-body">
                What We Stand For
              </p>
              <h2 className="text-3xl font-bold font-display sm:text-4xl text-green">
                The Four Pillars of Our Mission
              </h2>
              <div className="w-12 h-[3px] bg-gold mt-4 mx-auto rounded" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((p) => (
                <div key={p.title} className="p-6 transition-all bg-white border border-border rounded-xl hover:border-gold hover:-translate-y-1">
                  <div className="mb-4 text-3xl">{p.icon}</div>
                  <h3 className="mb-2 text-base font-bold font-display text-green">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted font-body">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-green sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid items-center grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-4 font-body">
                  Geographic Reference
                </p>
                <h2 className="mb-5 text-3xl font-bold text-white font-display sm:text-4xl">
                  From Pakistan to Every Corner of the World
                </h2>
                <p className="leading-relaxed text-white/70 font-body">
                  Equally those who have become renowned figures in their chosen field — wherever in the world they may be. Pride of Pakistan recognises achievement without borders, celebrating Pakistanis at home and across the global diaspora.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
                <Link
                  href="/who-is-who"
                  className="inline-flex items-center justify-center bg-gold text-white px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors"
                >
                  Explore Who Is Who →
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-white/20 transition-colors"
                >
                  Submit Your Profile
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}