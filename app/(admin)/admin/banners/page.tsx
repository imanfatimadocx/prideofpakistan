import { prisma } from "@/app/lib/prisma";
import BannersClient from "./BannersClient";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await prisma.eventBanner.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = banners.map((b) => ({
    id: b.id,
    type: b.type,
    title: b.title,
    message: b.message,
    image: b.image,
    ctaLabel: b.ctaLabel,
    ctaLink: b.ctaLink,
    color: b.color,
    active: b.active,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <div className="flex min-h-screen bg-cream">
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-[900px]">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold font-display text-green">
              Event Banners
            </h1>
            <p className="text-sm text-ink-muted font-body">
              Create announcements for events. Banners show and hide
              automatically based on dates.
            </p>
          </div>
          <BannersClient banners={serialized} />
        </div>
      </main>
    </div>
  );
}
