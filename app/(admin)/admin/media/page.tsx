import MediaAdminClient from "./MediaAdminClient";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [rows, categories] = await Promise.all([
    prisma.video.findMany({ orderBy: { datetime: "desc" } }).catch(() => []),
    prisma.videoCategory
      .findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
      .catch(() => []),
  ]);

  const videos = rows.map((v) => ({
    video_id: Number(v.video_id),
    title: v.title,
    video_embed_code: v.video_embed_code,
    thumb_url: v.thumb_url,
    status: v.status,
    featured: v.featured,
    views: Number(v.views),
    datetime: v.datetime.toISOString(),
    category: v.category,
  }));

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[900px]">
        <h1 className="mb-1 text-2xl font-bold font-display text-green">
          Pride TV Media
        </h1>
        <p className="mb-8 text-sm text-ink-muted font-body">
          Add YouTube videos with a custom caption. They appear as embedded
          players on the homepage and Pride TV page.
        </p>
        <MediaAdminClient
          videos={videos}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </div>
  );
}
