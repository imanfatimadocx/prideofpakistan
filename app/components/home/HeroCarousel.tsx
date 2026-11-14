import Link from "next/link";

interface Props {
  heading?: string;
  subtext?: string;
  image?: string | null;
}

// Ivory White hero. If the admin has uploaded a hero image in the homepage
// editor, it is shown behind the text with a light ivory layer for readability.
export default function HeroSection({ heading, subtext, image }: Props) {
  const bgImage = image && image.trim() !== "" ? image : null;

  return (
    <section className="relative overflow-hidden bg-ivory border-b border-sage py-16 sm:py-24 lg:py-28">
      {bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-ivory/70" />
        </>
      )}
      <div className="relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="max-w-[680px]">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] font-black text-green leading-[1.05] mb-5 -tracking-[.02em]">
              {heading && heading.trim() !== ""
                ? heading
                : "The Pride of Pakistan"}
            </h1>
            <p className="text-base sm:text-lg text-ink-mid font-body leading-relaxed mb-8 max-w-[520px]">
              {subtext && subtext.trim() !== ""
                ? subtext
                : "We honour the achievements of outstanding Pakistanis around the world, visionaries, entrepreneurs, innovators, and leaders whose talent, dedication, and integrity have made a lasting impact on their communities and beyond."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-leaf text-white px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-leaf-dark transition-colors"
              >
                About Us →
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center justify-center gap-2 bg-mint border border-sage text-green px-7 py-3.5 rounded-md font-semibold text-sm font-body hover:bg-sage transition-colors"
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
