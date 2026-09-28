import { prisma } from "@/app/lib/prisma";
import VideoCategoriesClient from "./VideoCategoriesClient";

export const dynamic = "force-dynamic";

export default async function VideoCategoriesPage() {
  const [categories, counts] = await Promise.all([
    prisma.videoCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.video.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);
  const countMap = new Map(counts.map((c) => [c.category, c._count._all]));
  const known = new Set(categories.map((c) => c.id));
  const uncategorised = counts
    .filter((c) => !known.has(c.category))
    .reduce((sum, c) => sum + c._count._all, 0);

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[700px]">
        <h1 className="mb-1 text-2xl font-bold font-display text-green">Pride TV Categories</h1>
        <p className="mb-8 text-sm text-ink-muted font-body">
          Group Pride TV videos into categories. Visitors can filter by these on the Pride TV page.
          Hidden categories don&apos;t appear on the website.
        </p>
        <VideoCategoriesClient
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            count: countMap.get(c.id) ?? 0,
          }))}
          uncategorised={uncategorised}
        />
      </div>
    </div>
  );
}
