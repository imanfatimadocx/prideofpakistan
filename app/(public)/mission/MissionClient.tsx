"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const PILLARS = [
  {
    title: "Global Representation",
    desc: "Highlighting Pakistanis who have made their mark across the world - in business, arts, science, sport, and public service.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Unity & Understanding",
    desc: "Building bridges between Pakistan, its diaspora, and the international community through shared stories of achievement.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Challenging Misconceptions",
    desc: "Countering negative narratives about Pakistan with real, verifiable stories of progress, talent, and contribution.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    title: "National Pride",
    desc: "Fostering a sense of pride in Pakistani identity - one rooted in diversity, resilience, hospitality, and hard work.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
];

function Carousel({
  images,
}: {
  images: { src: string; caption: string; href?: string | null }[];
}) {
  const [current, setCurrent] = useState(0);

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
    <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "600/350" }}>
  {images[current].href ? (
    <a href={images[current].href} className="block w-full h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current].src}
        alt={images[current].caption}
        className="object-cover object-top w-full h-full transition-all duration-700 hover:scale-105"
      />
    </a>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={images[current].src}
      alt={images[current].caption}
      className="object-cover object-top w-full h-full transition-all duration-700"
    />
  )}
  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 pointer-events-none bg-gradient-to-t from-black/70 to-transparent">
    <p className="text-sm leading-snug font-body text-white/90">
      {images[current].caption}
    </p>
    {images[current].href && (
      <p className="text-[11px] text-gold font-body mt-0.5">View Profile →</p>
    )}
  </div>
</div>
      <button
        onClick={prev}
        className="absolute flex items-center justify-center text-white transition-colors -translate-y-1/2 rounded-full opacity-0 left-3 top-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 group-hover:opacity-100"
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
      <button
        onClick={next}
        className="absolute flex items-center justify-center text-white transition-colors -translate-y-1/2 rounded-full opacity-0 right-3 top-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 group-hover:opacity-100"
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
      <div className="flex items-center justify-center gap-2 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-5 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-border hover:bg-gold/50"}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface MissionData {
  heading1: string;
  body1a: string;
  body1b: string;
  heading2: string;
  body2a: string;
  body2b: string;
  quote: string;
  body2c: string;
  images: { src: string; caption: string }[];
}

export default function MissionClient({ data }: { data: MissionData }) {
  return (
    <>
      <section className="py-16 bg-white sm:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="float-right w-full sm:w-[480px] ml-0 sm:ml-10 mb-6">
            <Carousel images={data.images} />
          </div>

          <h2 className="mb-5 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
            {data.heading1}
          </h2>
          <div className="w-12 h-[3px] bg-gold rounded mb-6" />
          <div className="mb-10 space-y-5 text-base leading-relaxed text-ink-mid font-body">
            <p>{data.body1a}</p>
            <p>{data.body1b}</p>
          </div>

          <h2 className="mb-5 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
            {data.heading2}
          </h2>
          <div className="w-12 h-[3px] bg-gold rounded mb-6" />
          <div className="mb-8 space-y-5 text-base leading-relaxed text-ink-mid font-body">
            <p>{data.body2a}</p>
            <p>{data.body2b}</p>
            <blockquote className="py-2 pl-5 border-l-4 border-gold">
              <p className="text-xl leading-snug font-display text-green">
                "{data.quote}"
              </p>
            </blockquote>
            <p>{data.body2c}</p>
          </div>

          <div className="flex flex-col clear-both gap-3 pt-2 sm:flex-row">
            <Link
              href="/who-is-who"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
            >
              Explore Who Is Who →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-colors rounded-md bg-green font-body hover:opacity-90"
            >
              Submit Your Profile
            </Link>
          </div>
        </div>
      </section>

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
              <div
                key={p.title}
                className="p-6 transition-all bg-white border border-border rounded-xl hover:border-gold hover:-translate-y-1"
              >
                <div className="mb-4 text-green">{p.icon}</div>
                <h3 className="mb-2 text-base font-bold font-display text-green">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted font-body">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
