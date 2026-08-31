'use client'
import { useState, useEffect } from "react";
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'
import Link from 'next/link'

const ALL_IMAGES = [
  {
    src: "/5.jpeg",
    caption:
      "Imtiaz Ahmad interviewing prime minister of Pakistan Zulifqar Ali Bhutto",
  },
  {
    src: "/2.jpeg",
    caption:
      "Imtiaz Ahmad receving award from HRH Prince Charles (now King Charles)",
  },
  {
    src: "/3.jpeg",
    caption: "Imtiaz Ahmad with Prime Minister of United Kingdom John Major.",
  },
  {
    src: "/4.jpeg",
    caption:
      " From left: Hanif Raja, Wajid S. U. Hussan, Tony Blair, M. Shoaib, Imtiaz Ahmad and M Sarwar MP",
  },
  {
    src: "/1.jpeg",
    caption: " Imtiaz Ahmad with Mohammad Sarwar Governor of Punjab",
  },
  {
    src: "/6.jpeg",
    caption: " Imtiaz Ahmad with Mohammad Sarwar Governor of Punjab",
  },
];
function Carousel({ images }: { images: { src: string; caption: string }[] }) {
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  function prev() {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }

  return (
    <div className="relative w-full group">
      {/* Image */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ aspectRatio: "600/350" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].src}
          alt={images[current].caption}
          className="w-full h-full object-cover object-top transition-all duration-700"
        />
        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-sm font-body text-white/90 leading-snug">
            {images[current].caption}
          </p>
        </div>
      </div>

      {/* Prev */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Previous"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Next"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current
                ? "w-5 h-1.5 bg-gold"
                : "w-1.5 h-1.5 bg-border hover:bg-gold/50"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

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
        
        {/* ── Main section ── */}
<section className="py-16 bg-white sm:py-20 lg:py-8">
  <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

    {/* Carousel floated right - text wraps around it */}
    <div className="float-right w-full sm:w-[480px] ml-0 sm:ml-10 mb-6">
      <Carousel images={ALL_IMAGES} />
    </div>

    {/* All text flows naturally around the floated carousel */}
    <h2 className="mb-5 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
      About the Founder
    </h2>
    <div className="mb-6 space-y-5 text-base leading-relaxed text-ink-mid font-body">
      <p>
        Imtiaz Ahmad, founder of Pride of Pakistan, is a seasoned journalist and media professional with decades of experience dedicated to promoting the positive image of Pakistan and its people. Over the course of his career, he has interviewed several influential figures, including the late Zulfikar Ali Bhutto, former Prime Minister of Pakistan.
      </p>
      <p>
        Imtiaz has also had the honour of engaging with notable international personalities, including receiving an award from HRH Prince Charles (now King Charles III) and meeting former UK Prime Ministers Tony Blair and John Major at official events. These experiences have helped shape his global perspective and reinforce his commitment to building bridges between Pakistan and the wider world.
      </p>
      <blockquote className="py-2 pl-5 border-l-4 border-gold">
        <p className="text-xl leading-snug font-display text-green">
          "Let's change the narrative - together."
        </p>
      </blockquote>
      <p>
        With Pride of Pakistan, Imtiaz set out to challenge widespread misconceptions about Pakistan - particularly those related to extremism and intolerance - by showcasing the country's true character: one rooted in diversity, progress, resilience, and hospitality.
      </p>
    </div>

    <h2 className="mb-5 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
      Building the Pride Team
    </h2>
    <div className="mb-8 space-y-5 text-base leading-relaxed text-ink-mid font-body">
      <p>
        To support this mission, Imtiaz is building the Pride Team - a growing network of individuals, communities, businesses, and organizations who believe in a brighter future for Pakistan. Together, they are working to amplify voices of positivity, hope, and change.
      </p>
      <p>
        Through inspiring stories and real-life achievements, Pride of Pakistan aims to foster understanding, unity, and national pride, while serving as a meaningful link between Pakistan, its global diaspora, and the international community.
      </p>
      <p>
        Join us. Share your story. Be part of a movement that redefines how the world sees Pakistan.
      </p>
    </div>

    <div className="flex flex-col clear-both gap-3 pt-2 sm:flex-row">
      <Link
        href="/register"
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
      >
        Submit Your Profile →
      </Link>
      <Link
        href="/membership"
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-colors rounded-md bg-green font-body hover:opacity-90"
      >
        Become a Member
      </Link>
    </div>

  </div>
</section>
      </main>
      <Footer />
    </>
  )
}