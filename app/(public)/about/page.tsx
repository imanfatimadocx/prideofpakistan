import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'
import Link from 'next/link'

const ABOUT_IMAGES = [
  '/5.jpeg',
  '/2.jpeg',
  '/3.jpeg',
  '/4.jpeg',
  '/1.jpeg',
  '/6.jpeg',
]

export default function AboutPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Story"
          title="About Pride of Pakistan"
          subtitle="A movement to challenge misconceptions and showcase the true character of Pakistan."
        />

        {/* Founder section */}
        <section className="py-16 bg-white sm:py-20 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

              {/* Sticky image */}
              <div className="relative">
                <div className="sticky top-24">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-green/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ABOUT_IMAGES[0]}
                      alt="Imtiaz Ahmad, Founder of Pride of Pakistan"
                      className="object-top w-full h-full object-fit"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-green/80 to-transparent">
                      <p className="text-xl font-bold text-white font-display">Imtiaz Ahmad</p>
                      <p className="text-sm text-gold-light font-body">Founder, Pride of Pakistan</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 mt-4 border bg-gold-pale border-gold/20 rounded-xl">
                    <span className="text-2xl"></span>
                    <div>
                      <p className="text-sm font-semibold text-ink-dark font-body">Award Recipient</p>
                      <p className="text-xs text-ink-muted font-body mt-0.5">
                        Awarded by HRH Prince Charles (now King Charles III)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrolling text */}
              <div className="space-y-8">
                <div>
                  <span className="inline-block bg-gold text-white text-[10px] font-bold tracking-[.14em] uppercase px-3.5 py-1.5 rounded mb-4 font-body">
                    About the Founder
                  </span>
                  <h2 className="mb-6 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
                    Decades Dedicated to Pakistan's Positive Image
                  </h2>
                </div>

                <p className="text-base leading-relaxed text-ink-mid font-body">
                  Imtiaz Ahmad, founder of Pride of Pakistan, is a seasoned journalist and media professional with decades of experience dedicated to promoting the positive image of Pakistan and its people. Over the course of his career, he has interviewed several influential figures, including the late Zulfikar Ali Bhutto, former Prime Minister of Pakistan.
                </p>

                <p className="text-base leading-relaxed text-ink-mid font-body">
                  Imtiaz has also had the honour of engaging with notable international personalities, including receiving an award from HRH Prince Charles (now King Charles III) and meeting former UK Prime Ministers Tony Blair and John Major at official events. These experiences have helped shape his global perspective and reinforce his commitment to building bridges between Pakistan and the wider world.
                </p>

                <blockquote className="py-2 pl-5 border-l-4 border-gold">
                  <p className="text-xl leading-snug font-display text-green">
                    "Let's change the narrative — together."
                  </p>
                </blockquote>

                <p className="text-base leading-relaxed text-ink-mid font-body">
                  With Pride of Pakistan, Imtiaz set out to challenge widespread misconceptions about Pakistan — particularly those related to extremism and intolerance — by showcasing the country's true character: one rooted in diversity, progress, resilience, and hospitality.
                </p>

                <p className="text-base leading-relaxed text-ink-mid font-body">
                  Through inspiring stories and real-life achievements, Pride of Pakistan aims to foster understanding, unity, and national pride, while serving as a meaningful link between Pakistan, its global diaspora, and the international community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pride Team section */}
        <section className="py-16 bg-cream sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

              <div className="order-2 space-y-6 lg:order-1">
                <span className="inline-block bg-green text-white text-[10px] font-bold tracking-[.14em] uppercase px-3.5 py-1.5 rounded font-body">
                  The Movement
                </span>
                <h2 className="text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
                  Building the Pride Team
                </h2>
                <p className="text-base leading-relaxed text-ink-mid font-body">
                  To support this mission, Imtiaz is building the Pride Team — a growing network of individuals, communities, businesses, and organizations who believe in a brighter future for Pakistan. Together, they are working to amplify voices of positivity, hope, and change.
                </p>
                <p className="text-base leading-relaxed text-ink-mid font-body">
                  Join us. Share your story. Be part of a movement that redefines how the world sees Pakistan.
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
                  >
                    Submit Your Profile →
                  </Link>
                  <Link
                    href="/membership"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-colors rounded-md bg-green font-body hover:bg-green-mid"
                  >
                    Become a Member
                  </Link>
                </div>
              </div>

              <div className="grid order-1 grid-cols-2 gap-4 lg:order-2">
                {ABOUT_IMAGES.slice(1).map((src, i) => (
                  <div key={i} className={`overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Pride of Pakistan — image ${i + 2}`}
                      className="w-full h-full transition-transform duration-500 object-fit hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-green sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-4 font-body">
              South Asians & Diaspora
            </p>
            <h2 className="mb-5 text-3xl font-bold text-white font-display sm:text-4xl">
              Explore, Support & Be Part of the Movement
            </h2>
            <p className="max-w-xl mx-auto mb-8 leading-relaxed text-white/70 font-body">
              Whether you are based in Pakistan or anywhere across the globe, your story matters. Together we redefine how the world sees Pakistan.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors"
            >
              Get in Touch →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}