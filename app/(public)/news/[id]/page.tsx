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
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const newsId = Number(id);
  if (Number.isNaN(newsId)) notFound();

  const item = await prisma.latestNews.findUnique({ where: { id: newsId } });
  if (!item || item.status !== 1) notFound();

  const coverImage = resolveImage(item.smallimage);
  const images =
    (item.images as { src: string; caption: string }[] | null) ?? [];

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[920px] mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-14">
          {/* Back */}
          <Link
            href="/news"
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
            Back to Latest News
          </Link>

          {/* Date */}
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold font-body mb-3">
            {new Date(item.date_time).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-green leading-tight mb-4">
            {item.title}
          </h1>

          {/* Short desc */}
          {item.shortdesc && (
            <p className="text-base text-ink-mid font-body leading-relaxed mb-6 pb-6 border-b border-border">
              {item.shortdesc}
            </p>
          )}

          {/* Cover image */}
          {coverImage && images.length === 0 && (
            <div
              className="w-full overflow-hidden rounded-xl mb-8"
              style={{ aspectRatio: "600/350" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={item.title}
                className="w-full h-full object-fit object-top"
              />
            </div>
          )}

          {/* Article body — images float right */}
          <div className="relative">
            {/* Float images */}
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

            {/* Article text */}
            <div
              className="prose prose-neutral max-w-none font-body text-ink-mid leading-relaxed prose-headings:font-display prose-headings:text-green prose-a:text-gold prose-strong:text-ink-dark"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />

            <div className="clear-both" />
          </div>

          {/* Share */}
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://prideofpakistan.com/news/${newsId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors no-underline font-body"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${item.title} — https://prideofpakistan.com/news/${newsId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded hover:bg-green-100 transition-colors no-underline font-body"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
