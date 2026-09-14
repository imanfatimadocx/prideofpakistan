import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { getPageContent } from "@/app/lib/pageContent";

export const revalidate = 30;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  return `/uploads/${img}`;
}

export default async function YourStoriesPage() {
  const [stories, session, hero] = await Promise.all([
    prisma.userStory.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    }),
    getServerSession(authOptions),
    getPageContent("page_stories"),
  ]);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Left-aligned hero — matches other pages */}
        <div className="px-4 py-10 bg-green sm:px-8 lg:px-12 sm:py-14">
          <div className="max-w-[1280px] mx-auto">
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
              {hero.eyebrow}
            </p>
            <h1 className="mb-3 text-3xl font-black leading-tight text-white font-display sm:text-4xl lg:text-5xl">
              {hero.heading}
            </h1>
            {hero.subtext && (
              <p className="text-white/65 font-body text-sm sm:text-base max-w-[560px]">
                {hero.subtext}
              </p>
            )}
          </div>
        </div>

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
            <div className="py-20 text-center bg-white border border-border rounded-2xl">
              <p className="px-4 mb-2 text-ink-muted font-body">
                No stories yet.
              </p>
              <p className="px-4 text-sm text-ink-muted font-body">
                Be the first to share your story.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => {
                const image = resolveImage(story.image);
                return (
                  <Link
                    key={story.id}
                    href={`/your-stories/${story.id}`}
                    className="no-underline group"
                  >
                    {/* Plain image — no card, matches homepage style */}
                    <div
                      className="w-full overflow-hidden rounded-lg"
                      style={{ aspectRatio: "600/350" }}
                    >
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={story.title}
                          className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-green/10">
                          <span className="text-4xl font-bold font-display text-green/30">
                            {story.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Caption */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold tracking-[.12em] uppercase text-gold font-body mb-1.5">
                        By {story.authorName} ·{" "}
                        {new Date(story.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h2 className="mb-1 text-base font-bold leading-snug transition-colors font-display text-green group-hover:text-gold line-clamp-2">
                        {story.title}
                      </h2>
                      {story.shortdesc && (
                        <p className="text-xs leading-relaxed text-ink-muted font-body line-clamp-2">
                          {story.shortdesc}
                        </p>
                      )}
                      <p className="mt-2 text-[11px] font-semibold text-gold font-body">
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
