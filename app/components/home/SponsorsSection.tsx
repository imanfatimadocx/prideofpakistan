import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";

/** Homepage strip of live sponsor logos. Renders nothing when there are none. */
export default async function SponsorsSection() {
  const sponsors = await prisma.sponsor
    .findMany({
      where: { status: 1 },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      take: 12,
    })
    .catch(() => []);

  if (sponsors.length === 0) return null;

  return (
    <section className="py-14 bg-white border-t border-border sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
              Our Supporters
            </p>
            <h2 className="text-2xl font-bold font-display sm:text-3xl text-green">Our Sponsors</h2>
          </div>
          <Link href="/our-sponsors" className="text-sm font-semibold no-underline text-gold font-body hover:underline">
            View all sponsors →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((s) => {
            const logo = resolveImage(s.smallimage);
            const inner = logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={s.title}
                className="object-contain w-full h-full transition duration-300 grayscale group-hover:grayscale-0"
              />
            ) : (
              <span className="text-sm font-bold text-center font-display text-green">{s.title}</span>
            );
            const cls =
              "group flex items-center justify-center h-24 p-4 border rounded-xl border-border bg-cream/50 hover:border-gold hover:bg-white transition-colors no-underline";
            return s.website ? (
              <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer sponsored" title={s.title} className={cls}>
                {inner}
              </a>
            ) : (
              <div key={s.id} title={s.title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
