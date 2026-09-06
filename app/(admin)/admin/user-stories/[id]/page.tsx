import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import Link from "next/link";
import UserStoryActions from "./UserStoryActions";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function AdminUserStoryDetailPage({ params }: Props) {
  const { id } = await params;
  const storyId = Number(id);
  if (Number.isNaN(storyId)) notFound();

  const story = await prisma.userStory.findUnique({ where: { id: storyId } });
  if (!story) notFound();

  const images =
    (story.images as { src: string; caption: string }[] | null) ?? [];

  function resolveImage(img: string | null): string | null {
    if (!img || img.trim() === "") return null;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return `/uploads/${img}`;
  }

  const coverImage = resolveImage(story.image);

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 lg:ml-64 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[900px]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/user-stories"
                className="text-sm no-underline text-gold font-body hover:underline"
              >
                ← User Stories
              </Link>
              <span className="text-ink-muted">/</span>
              <h1 className="font-display text-xl font-bold text-green line-clamp-1">
                {story.title}
              </h1>
            </div>
            {/* Status badge */}
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full font-body ${
                story.status === "approved"
                  ? "bg-green/10 text-green"
                  : story.status === "rejected"
                    ? "bg-red-50 text-red-600"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* Left — story content */}
            <div className="space-y-5">
              {/* Cover image */}
              {coverImage && (
                <div
                  className="w-full overflow-hidden rounded-xl"
                  style={{ aspectRatio: "600/350" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={story.title}
                    className="w-full h-full object-fit object-top"
                  />
                </div>
              )}

              {/* Short description */}
              {story.shortdesc && (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="bg-green/10 border-b border-border px-5 py-3">
                    <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">
                      Summary
                    </h2>
                  </div>
                  <p className="px-5 py-4 text-sm leading-relaxed text-ink-mid font-body">
                    {story.shortdesc}
                  </p>
                </div>
              )}

              {/* Full content */}
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="bg-green/10 border-b border-border px-5 py-3">
                  <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">
                    Story Content
                  </h2>
                </div>
                <div className="px-5 py-4 text-sm leading-relaxed text-ink-mid font-body whitespace-pre-wrap">
                  {story.content}
                </div>
              </div>

              {/* Additional images */}
              {images.length > 0 && (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="bg-green/10 border-b border-border px-5 py-3">
                    <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">
                      Images
                    </h2>
                  </div>
                  <div className="p-5 space-y-4">
                    {images.map((img, i) => (
                      <div key={i}>
                        <div
                          className="w-full overflow-hidden rounded-xl"
                          style={{ aspectRatio: "600/350" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.src}
                            alt={img.caption}
                            className="w-full h-full object-fit object-top"
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
                </div>
              )}
            </div>

            {/* Right sidebar — author info + actions */}
            <div className="space-y-5">
              {/* Author */}
              <div className="bg-white border border-border rounded-xl p-5 space-y-3">
                <h2 className="font-display text-base font-bold text-green">
                  Author
                </h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide font-body mb-0.5">
                      Name
                    </p>
                    <p className="text-sm text-ink-dark font-body">
                      {story.authorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide font-body mb-0.5">
                      Email
                    </p>
                    <a
                      href={`mailto:${story.authorEmail}`}
                      className="text-sm text-gold hover:underline no-underline font-body"
                    >
                      {story.authorEmail}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide font-body mb-0.5">
                      Submitted
                    </p>
                    <p className="text-sm text-ink-muted font-body">
                      {new Date(story.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <UserStoryActions
                storyId={story.id}
                currentStatus={story.status}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
