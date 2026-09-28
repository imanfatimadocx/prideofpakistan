import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import { getPageContent } from "@/app/lib/pageContent";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Sponsors | Pride of Pakistan",
  description: "The organisations and businesses supporting Pride of Pakistan.",
};

export default async function OurSponsorsPage() {
  const [hero, sponsors] = await Promise.all([
    getPageContent("page_sponsors"),
    prisma.sponsor
      .findMany({
        where: { status: 1 },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      })
      .catch(() => []),
  ]);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.heading}
          subtitle={hero.subtext}
        />

        <section className="py-14 sm:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {sponsors.length === 0 ? (
              <div className="py-20 text-center bg-white border border-border rounded-2xl">
                <p className="text-sm text-ink-muted font-body">
                  Our sponsors will be listed here soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                {sponsors.map((s) => {
                  const logo = resolveImage(s.smallimage);
                  const image = (
                    <div
                      className="flex items-center justify-center w-full overflow-hidden rounded-lg"
                      style={{ aspectRatio: "650/500" }}
                    >
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt={s.title}
                          loading="lazy"
                          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white rounded-lg bg-green font-display">
                          {s.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                  return (
                    <div key={s.id} className="group">
                      {/* Plain image - no card, no border (same as Who Is Who) */}
                      {s.website ? (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="block no-underline"
                        >
                          {image}
                        </a>
                      ) : (
                        image
                      )}

                      {/* Content underneath */}
                      <div className="mt-2.5">
                        <p className="text-sm font-bold leading-snug transition-colors text-ink-dark font-display group-hover:text-green">
                          {s.title}
                        </p>
                        {s.shortdesc && (
                          <p className="mt-1 text-xs leading-relaxed text-left text-ink-mid font-body line-clamp-3">
                            {s.shortdesc}
                          </p>
                        )}
                        {s.website && (
                          <a
                            href={s.website}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="inline-block mt-1.5 text-xs font-semibold no-underline text-gold font-body hover:underline"
                          >
                            Visit website ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-6 mt-12 text-center border sm:p-8 bg-green/5 border-green/20 rounded-2xl">
              <h2 className="mb-2 text-xl font-bold font-display text-green">
                Become a Sponsor
              </h2>
              <p className="mb-5 text-sm text-center text-ink-mid font-body">
                Help us share the best of Pakistan with the world.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white no-underline transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
