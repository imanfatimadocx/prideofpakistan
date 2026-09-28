import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import SponsorsClient from "./SponsorsClient";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[900px]">
        <h1 className="mb-1 text-2xl font-bold font-display text-green">Sponsors</h1>
        <p className="mb-8 text-sm text-ink-muted font-body">
          Live sponsors appear on the homepage and the{" "}
          <a href="/our-sponsors" target="_blank" className="text-gold hover:underline">
            Our Sponsors
          </a>{" "}
          page, in the order shown here.
        </p>
        <SponsorsClient
          sponsors={sponsors.map((s) => ({
            id: s.id,
            title: s.title,
            shortdesc: s.shortdesc,
            smallimage: resolveImage(s.smallimage) ?? "",
            website: s.website,
            status: s.status,
          }))}
        />
      </div>
    </div>
  );
}
