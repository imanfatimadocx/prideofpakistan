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
            <h2 className="text-2xl font-bold font-display sm:text-3xl text-green">
              Our Sponsors
            </h2>
          </div>
          <Link
            href="/our-sponsors"
            className="text-sm font-semibold no-underline text-gold font-body hover:underline"
          >
            View all sponsors →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-4 lg:grid-cols-6">
          {sponsors.map((s) => {
            const logo = resolveImage(s.smallimage);

            const image = (
              <div
                className="w-full overflow-hidden rounded-lg"
                style={{ aspectRatio: "650/500" }}
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt={s.title}
                    loading="lazy"
                    className="object-cover w-full h-full transition-transform duration-300 rounded-lg group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white rounded-lg bg-green font-display">
                    {s.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );

            const name = (
              <p className="mt-2 text-[11px] sm:text-xs font-bold leading-snug transition-colors text-ink-dark font-display group-hover:text-green line-clamp-2">
                {s.title}
              </p>
            );

            return s.website ? (
              <a
                key={s.id}
                href={s.website}
                target="_blank"
                rel="noopener noreferrer sponsored"
                title={`Visit ${s.title}`}
                className="block no-underline group"
              >
                {image}
                {name}
              </a>
            ) : (
              <div key={s.id} className="group">
                {image}
                {name}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
