import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export const revalidate = 3600;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  return `/uploads/${img}`;
}

export default async function YourStoriesPage() {
  const [stories, session] = await Promise.all([
    prisma.userStory.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    }),
    getServerSession(authOptions),
  ]);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero
          eyebrow="Community"
          title="Your Stories"
          subtitle="Stories shared by Pakistanis from around the world."
        />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
          {/* Submit CTA */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-ink-muted font-body">
              {stories.length} stor{stories.length === 1 ? "y" : "ies"} shared
            </p>
            {session ? (
              <Link
                href="/your-stories/submit"
                className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
              >
                Share Your Story →
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
              >
                Login to Share Your Story →
              </Link>
            )}
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-20 bg-white border border-border rounded-2xl">
              <p className="text-ink-muted font-body mb-2">No stories yet.</p>
              <p className="text-sm text-ink-muted font-body">
                Be the first to share your story.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => {
                const image = resolveImage(story.image);
                return (
                  <Link
                    key={story.id}
                    href={`/your-stories/${story.id}`}
                    className="no-underline group bg-white border border-border rounded-xl overflow-hidden hover:border-gold hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-full overflow-hidden"
                      style={{ aspectRatio: "600/350" }}
                    >
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={story.title}
                          className="w-full h-full object-fit object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-green/10 flex items-center justify-center">
                          <span className="font-display text-4xl font-bold text-green/30">
                            {story.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-bold tracking-[.12em] uppercase text-gold font-body mb-2">
                        By {story.authorName} ·{" "}
                        {new Date(story.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h2 className="font-display text-base font-bold text-green leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
                        {story.title}
                      </h2>
                      {story.shortdesc && (
                        <p className="text-sm text-ink-muted font-body leading-relaxed line-clamp-3">
                          {story.shortdesc}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-gold font-body mt-3">
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
