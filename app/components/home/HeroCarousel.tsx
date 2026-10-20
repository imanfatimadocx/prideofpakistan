import Link from "next/link";

interface Props {
  heading?: string;
  subtext?: string;
  image?: string | null;
}

export default function HeroSection({ heading, subtext, image }: Props) {
  const bgImage = image && image.trim() !== "" ? image : "/test-bg.jpeg";

  return (
    <section className="relative overflow-hidden min-h-[520px] h-[calc(100svh-8rem)] sm:h-[75vh] lg:h-[80vh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgImage}
        alt="Pakistan"
        className="absolute inset-0 object-cover object-center w-full h-full"
      />
      <div className="absolute inset-0 bg-ivory/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-sage/40 via-mint/20 to-ivory/90" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="max-w-[680px]">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] font-black text-green leading-[1.05] mb-5 -tracking-[.02em]">
              {heading && heading.trim() !== ""
                ? heading
                : "The Pride of Pakistan"}
            </h1>
            <p className="text-base sm:text-lg text-slate font-body leading-relaxed mb-8 max-w-[520px]">
              {subtext && subtext.trim() !== ""
                ? subtext
                : "We honour the achievements of outstanding Pakistanis around the world, visionaries, entrepreneurs, innovators, and leaders whose talent, dedication, and integrity have made a lasting impact on their communities and beyond."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-leaf text-green px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-leaf-light hover:text-ink-dark transition-colors"
              >
                About Us →
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center justify-center gap-2 bg-ivory border border-green/25 text-green px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-mint hover:text-ink-dark transition-colors"
              >
                Our Mission →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
