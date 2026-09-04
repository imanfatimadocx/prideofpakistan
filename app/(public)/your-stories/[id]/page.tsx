import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Link from "next/link";

export const revalidate = 3600;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  return `/uploads/${img}`;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;
  const storyId = Number(id);
  if (Number.isNaN(storyId)) notFound();

  const story = await prisma.userStory.findUnique({ where: { id: storyId } });
  if (!story || story.status !== "approved") notFound();

  const coverImage = resolveImage(story.image);
  const images =
    (story.images as { src: string; caption: string }[] | null) ?? [];

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-14">
          <Link
            href="/your-stories"
            className="flex items-center gap-2 text-sm font-semibold no-underline text-gold font-body hover:underline mb-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Your Stories
          </Link>

          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold font-body mb-3">
            By {story.authorName} ·{" "}
            {new Date(story.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-green leading-tight mb-4">
            {story.title}
          </h1>

          {story.shortdesc && (
            <p className="text-base text-ink-mid font-body leading-relaxed mb-6 pb-6 border-b border-border">
              {story.shortdesc}
            </p>
          )}

          {coverImage && images.length === 0 && (
            <div
              className="w-full overflow-hidden rounded-xl mb-8"
              style={{ aspectRatio: "600/350" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={story.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}

          <div className="relative">
            {images.length > 0 && (
              <div className="float-right w-full sm:w-[340px] ml-0 sm:ml-8 mb-6 space-y-4">
                {images.map((img, i) => (
                  <div key={i} className="w-full">
                    <div
                      className="w-full overflow-hidden rounded-xl"
                      style={{ aspectRatio: "600/350" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.caption}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {img.caption && (
                      <p className="text-xs text-ink-muted font-body mt-1.5 italic">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="prose prose-neutral max-w-none font-body text-ink-mid leading-relaxed prose-headings:font-display prose-headings:text-green prose-a:text-gold">
              {story.content}
            </div>

            <div className="clear-both" />
          </div>

          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${story.title} — https://prideofpakistan.com/your-stories/${storyId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded hover:bg-green-100 transition-colors no-underline font-body"
            >
              WhatsApp Share
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
