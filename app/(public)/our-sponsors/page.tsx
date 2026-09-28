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
      .findMany({ where: { status: 1 }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })
      .catch(() => []),
  ]);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero eyebrow={hero.eyebrow} title={hero.heading} subtitle={hero.subtext} />

        <section className="py-14 sm:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {sponsors.length === 0 ? (
              <div className="py-20 text-center bg-white border border-border rounded-2xl">
                <p className="text-sm text-ink-muted font-body">Our sponsors will be listed here soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sponsors.map((s) => {
                  const logo = resolveImage(s.smallimage);
                  return (
                    <div key={s.id} className="flex flex-col overflow-hidden bg-white border border-border rounded-2xl">
                      <div className="flex items-center justify-center h-40 p-6 border-b border-border bg-cream/40">
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt={s.title} className="object-contain w-full h-full" />
                        ) : (
                          <span className="text-4xl font-bold font-display text-green">{s.title.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <h2 className="mb-2 text-lg font-bold leading-snug font-display text-green">{s.title}</h2>
                        {s.shortdesc && (
                          <p className="flex-1 text-sm leading-relaxed text-left text-ink-mid font-body">{s.shortdesc}</p>
                        )}
                        {s.website && (
                          <a
                            href={s.website}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold no-underline text-gold font-body hover:underline"
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
              <h2 className="mb-2 text-xl font-bold font-display text-green">Become a Sponsor</h2>
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
