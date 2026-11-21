import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import { AD_SLOTS, isAdSlotKey, statDay, type AdSlotKey } from "@/app/lib/ads";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

const RANGES = [
  { key: "7", label: "Last 7 days", days: 7 },
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "90", label: "Last 90 days", days: 90 },
  { key: "all", label: "All time", days: 0 },
] as const;

function fmt(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function AdReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const { range = "30" } = await searchParams;
  const r = RANGES.find((x) => x.key === range) ?? RANGES[1];

  const ad = await prisma.advertisement.findUnique({ where: { id } }).catch(() => null);
  if (!ad) notFound();

  const since = r.days ? statDay(new Date(Date.now() - (r.days - 1) * 86400000)) : null;
  type StatRow = { id: number; day: Date; views: number; clicks: number };
  const rows: StatRow[] = await prisma.adStat
    .findMany({
      where: { adId: id, ...(since ? { day: { gte: since } } : {}) },
      orderBy: { day: "desc" },
    })
    .catch(() => []);

  const views = rows.reduce((s, x) => s + x.views, 0);
  const clicks = rows.reduce((s, x) => s + x.clicks, 0);
  const rate = views ? `${((clicks / views) * 100).toFixed(2)}%` : "–";
  const placements = ((Array.isArray(ad.placements) ? ad.placements : []) as unknown[])
    .filter(isAdSlotKey)
    .map((k: AdSlotKey) => AD_SLOTS[k].label);
  const banner = resolveImage(ad.imageDesktop) ?? resolveImage(ad.imageSquare);
  const maxViews = Math.max(1, ...rows.map((x) => x.views));

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[900px]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
          <Link href="/admin/ads" className="text-sm no-underline text-leaf-dark font-body hover:underline">
            ← All ads
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {RANGES.map((x) => (
              <Link
                key={x.key}
                href={`/admin/ads/${id}?range=${x.key}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold font-body border no-underline ${x.key === r.key ? "bg-leaf text-white border-leaf" : "bg-white text-ink-mid border-border hover:border-leaf"}`}
              >
                {x.label}
              </Link>
            ))}
            <PrintButton />
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white border border-border rounded-xl">
          <div>
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-slate font-body">Advertising report · Pride of Pakistan</p>
            <h1 className="mt-1 text-2xl font-bold font-display text-green">{ad.advertiser}</h1>
            <p className="text-sm text-ink-muted font-body">
              {ad.title} · {r.label}
              {since ? ` (${fmt(since)} – ${fmt(statDay())})` : ""}
            </p>
          </div>

          {banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={banner} alt={ad.advertiser} className="block w-full h-auto border rounded-xl border-border" />
          )}

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Views", value: views.toLocaleString() },
              { label: "Clicks", value: clicks.toLocaleString() },
              { label: "Click rate", value: rate },
            ].map((s) => (
              <div key={s.label} className="p-4 text-center border rounded-lg border-border bg-cream">
                <p className="text-2xl font-bold text-green font-display">{s.value}</p>
                <p className="text-xs uppercase text-ink-muted font-body">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="text-sm text-ink-mid font-body">
            <p>
              <strong className="text-ink-dark">Runs:</strong> {fmt(ad.startsAt)} – {ad.endsAt ? fmt(ad.endsAt) : "no end date"}
            </p>
            <p>
              <strong className="text-ink-dark">Shown in:</strong> {placements.join(", ") || "–"}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-bold font-display text-green">Day by day</h2>
            {rows.length === 0 ? (
              <p className="text-sm text-ink-muted font-body">No views or clicks recorded in this period yet.</p>
            ) : (
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-left border-b border-border text-[11px] uppercase tracking-wide text-ink-muted">
                    <th className="py-2 font-semibold">Date</th>
                    <th className="py-2 font-semibold">Views</th>
                    <th className="py-2 font-semibold text-right">Clicks</th>
                    <th className="py-2 font-semibold text-right">Click rate</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x.id} className="border-b border-border/60">
                      <td className="py-2 text-ink-dark">{fmt(x.day)}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span className="w-12 tabular-nums">{x.views.toLocaleString()}</span>
                          <span className="h-2 rounded bg-sage" style={{ width: `${Math.round((x.views / maxViews) * 160)}px` }} />
                        </div>
                      </td>
                      <td className="py-2 text-right tabular-nums">{x.clicks.toLocaleString()}</td>
                      <td className="py-2 text-right tabular-nums">{x.views ? `${((x.clicks / x.views) * 100).toFixed(1)}%` : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="mt-3 text-[11px] text-ink-muted font-body">
              A view is counted when at least half of the ad appears on a visitor&apos;s screen. Search-engine bots are not counted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
