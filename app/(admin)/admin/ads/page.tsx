import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import { AD_SLOTS, AD_SLOT_KEYS, AD_SIZES, getAdSettings, isAdSlotKey, statDay, type AdSlotKey } from "@/app/lib/ads";
import AdsClient, { type AdminAd } from "./AdsClient";

export const dynamic = "force-dynamic";

type AdRow = {
  id: number;
  title: string;
  advertiser: string;
  imageDesktop: string;
  imageMobile: string;
  imageSquare: string;
  altText: string;
  linkUrl: string;
  placements: unknown;
  startsAt: Date;
  endsAt: Date | null;
  status: number;
  priority: number;
};

function dayString(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function AdminAdsPage() {
  let ads: AdminAd[] = [];
  let tableMissing = false;

  try {
    const since = statDay(new Date(Date.now() - 29 * 86400000));
    const [rows, totals, recent] = await Promise.all([
      prisma.advertisement.findMany({ orderBy: [{ status: "desc" }, { startsAt: "desc" }] }),
      prisma.adStat.groupBy({ by: ["adId"], _sum: { views: true, clicks: true } }),
      prisma.adStat.groupBy({ by: ["adId"], where: { day: { gte: since } }, _sum: { views: true, clicks: true } }),
    ]);
    type Sum = { views: number | null; clicks: number | null };
    type SumRow = { adId: number; _sum: Sum };
    const total = new Map<number, Sum>((totals as SumRow[]).map((t) => [t.adId, t._sum]));
    const last30 = new Map<number, Sum>((recent as SumRow[]).map((t) => [t.adId, t._sum]));

    ads = rows.map((a: AdRow) => ({
      id: a.id,
      title: a.title,
      advertiser: a.advertiser,
      imageDesktop: a.imageDesktop,
      imageMobile: a.imageMobile,
      imageSquare: a.imageSquare,
      preview: resolveImage(a.imageDesktop) ?? resolveImage(a.imageSquare) ?? "",
      altText: a.altText,
      linkUrl: a.linkUrl,
      placements: ((Array.isArray(a.placements) ? a.placements : []) as unknown[]).filter(isAdSlotKey) as AdSlotKey[],
      startsAt: dayString(a.startsAt),
      endsAt: dayString(a.endsAt),
      status: a.status,
      priority: a.priority,
      views: total.get(a.id)?.views ?? 0,
      clicks: total.get(a.id)?.clicks ?? 0,
      views30: last30.get(a.id)?.views ?? 0,
      clicks30: last30.get(a.id)?.clicks ?? 0,
    }));
  } catch (err) {
    console.error("Admin ads:", err);
    tableMissing = true;
  }

  const settings = await getAdSettings();
  const slots = AD_SLOT_KEYS.map((k) => ({
    key: k,
    label: AD_SLOTS[k].label,
    kind: AD_SLOTS[k].kind,
    mode: settings.slots[k].mode,
  }));

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[1000px]">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-1">
          <h1 className="text-2xl font-bold font-display text-green">Advertisements</h1>
          <Link href="/admin/ads/settings" className="text-sm font-semibold no-underline text-leaf-dark font-body hover:underline">
            Ad spaces &amp; settings →
          </Link>
        </div>
        <p className="mb-8 text-sm text-ink-muted font-body">
          Sponsor ads you arrange directly. An ad only shows in spaces set to <strong>Our ads</strong> in{" "}
          <Link href="/admin/ads/settings" className="text-leaf-dark hover:underline">Ad spaces &amp; settings</Link>.
          Poster sizes: desktop {AD_SIZES.desktop}, mobile {AD_SIZES.mobile}, showcase {AD_SIZES.square}.
        </p>

        {tableMissing ? (
          <div className="p-6 text-sm border rounded-xl border-amber-200 bg-amber-50 text-amber-800 font-body">
            The advertising tables aren&apos;t in the database yet. Run the file{" "}
            <code>prisma/sql/2026-11-advertisements.sql</code> once in phpMyAdmin, then reload this page.
          </div>
        ) : (
          <AdsClient ads={ads} slots={slots} />
        )}
      </div>
    </div>
  );
}
