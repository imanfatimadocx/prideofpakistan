"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function Carousel({ images }: { images: { src: string; caption: string }[] }) {
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
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ aspectRatio: "600/350" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].src}
          alt={images[current].caption}
          className="object-cover object-top w-full h-full transition-all duration-700"
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-sm leading-snug font-body text-white/90">
            {images[current].caption}
          </p>
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

interface AboutData {
  heading1: string;
  body1a: string;
  body1b: string;
  quote: string;
  body1c: string;
  heading2: string;
  body2a: string;
  body2b: string;
  body2c: string;
  images: { src: string; caption: string }[];
}

export default function AboutClient({ data }: { data: AboutData }) {
  return (
    <section className="py-16 bg-white sm:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="float-right w-full sm:w-[480px] ml-0 sm:ml-10 mb-6">
          <Carousel images={data.images} />
        </div>

        <h2 className="mb-5 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
          {data.heading1}
        </h2>
        <div className="mb-6 space-y-5 text-base leading-relaxed text-ink-mid font-body">
          <p>{data.body1a}</p>
          <p>{data.body1b}</p>
          <blockquote className="py-2 pl-5 border-l-4 border-gold">
            <p className="text-xl leading-snug font-display text-green">
              "{data.quote}"
            </p>
          </blockquote>
          <p>{data.body1c}</p>
        </div>

        <h2 className="mb-5 text-3xl font-bold leading-tight font-display sm:text-4xl text-green">
          {data.heading2}
        </h2>
        <div className="mb-8 space-y-5 text-base leading-relaxed text-ink-mid font-body">
          <p>{data.body2a}</p>
          <p>{data.body2b}</p>
          <p>{data.body2c}</p>
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
  );
}
