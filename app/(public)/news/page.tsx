import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Link from "next/link";
import PageHero from "@/app/components/shared/PageHero";
import { getPageContent } from "@/app/lib/pageContent";

export const revalidate = 30;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

export default async function NewsPage() {
  const news = await prisma.latestNews.findMany({
    where: { status: 1 },
    orderBy: { date_time: "desc" },
  });
  const hero = await getPageContent("page_news");
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
          {news.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-ink-muted font-body">No news published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => {
                const image = resolveImage(item.smallimage);
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="overflow-hidden no-underline transition-all bg-white border group border-border rounded-xl hover:border-gold hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Cover */}
                    <div
                      className="w-full overflow-hidden"
                      style={{ aspectRatio: "600/350" }}
                    >
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={item.title}
                          className="object-top w-full h-full transition-transform duration-300 object-fit group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-green/10">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-green/40"
                          >
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-5">
                      <p className="text-[11px] font-bold tracking-[.12em] uppercase text-gold font-body mb-2">
                        {new Date(item.date_time).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <h2 className="mb-2 text-base font-bold leading-snug transition-colors font-display text-green group-hover:text-gold line-clamp-2">
                        {item.title}
                      </h2>
                      {item.shortdesc && (
                        <p className="text-sm leading-relaxed text-ink-muted font-body line-clamp-3">
                          {item.shortdesc}
                        </p>
                      )}
                      <p className="mt-3 text-xs font-semibold text-gold font-body">
                        Read more →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
