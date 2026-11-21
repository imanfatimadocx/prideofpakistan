import { cache } from "react";
import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import { plainText } from "@/app/lib/sanitize";

/* ─── Ad spaces ─────────────────────────────────────────────────────────── */

export const AD_SLOTS = {
  home_top: {
    label: "Homepage – below the main banner",
    where: "Homepage, just below the main heading",
    kind: "banner",
  },
  home_middle: {
    label: "Homepage – between sections",
    where: "Homepage, between Who Is Who and Pakistani Products",
    kind: "banner",
  },
  profile: {
    label: "Who Is Who profile pages",
    where: "Below the details on every Who Is Who profile",
    kind: "banner",
  },
  business: {
    label: "Business pages",
    where: "Below the details on every business page",
    kind: "banner",
  },
  article: {
    label: "Stories and Discussion Forum posts",
    where: "Below the article on every story and forum post",
    kind: "banner",
  },
  footer_banner: {
    label: "Above the footer – banner",
    where: "A wide banner above the footer on every page",
    kind: "banner",
  },
  footer_showcase: {
    label: "Above the footer – sponsor showcase",
    where: "A grid of sponsor cards above the footer on every page, like Our Sponsors",
    kind: "showcase",
  },
} as const;

export type AdSlotKey = keyof typeof AD_SLOTS;
export const AD_SLOT_KEYS = Object.keys(AD_SLOTS) as AdSlotKey[];

export function isAdSlotKey(v: unknown): v is AdSlotKey {
  return typeof v === "string" && v in AD_SLOTS;
}

/** Recommended poster sizes, shown in admin and on the Advertise page. */
export const AD_SIZES = {
  desktop: "1200 × 250 px",
  mobile: "600 × 300 px",
  square: "400 × 400 px",
};

/** How many sponsor cards the showcase shows at most. */
export const SHOWCASE_MAX = 6;

/* ─── Settings (stored in page_content, key "ad_settings") ──────────────── */

export type SlotMode = "ours" | "google";

/**
 * "ours": the space shows sponsor ads booked for it (nothing if none are booked).
 * "google": the space stays empty and Google's automatic ads decide where to place ads.
 */
export interface SlotSetting {
  mode: SlotMode;
}

export interface AdSettings {
  label: string;
  slots: Record<AdSlotKey, SlotSetting>;
}

const SETTINGS_KEY = "ad_settings";

export function defaultAdSettings(): AdSettings {
  const slots = {} as Record<AdSlotKey, SlotSetting>;
  for (const k of AD_SLOT_KEYS) slots[k] = { mode: "google" };
  return { label: "Sponsored", slots };
}

function normaliseSettings(raw: unknown): AdSettings {
  const base = defaultAdSettings();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as { label?: unknown; slots?: Record<string, unknown> };
  const label = plainText(r.label, 40);
  if (label) base.label = label;
  for (const k of AD_SLOT_KEYS) {
    const s = r.slots?.[k] as Partial<SlotSetting> | undefined;
    if (!s) continue;
    base.slots[k] = { mode: s.mode === "ours" ? "ours" : "google" };
  }
  return base;
}

export const getAdSettings = cache(async function getAdSettings(): Promise<AdSettings> {
  try {
    const row = await prisma.pageContent.findUnique({ where: { page: SETTINGS_KEY } });
    return normaliseSettings(row?.content);
  } catch {
    return defaultAdSettings();
  }
});

export async function saveAdSettings(raw: unknown): Promise<AdSettings> {
  const settings = normaliseSettings(raw);
  const content = JSON.parse(JSON.stringify(settings));
  await prisma.pageContent.upsert({
    where: { page: SETTINGS_KEY },
    create: { page: SETTINGS_KEY, content },
    update: { content },
  });
  return settings;
}

/* ─── Ads ───────────────────────────────────────────────────────────────── */

/** What the website needs to show one sponsor ad. */
export interface PublicAd {
  id: number;
  advertiser: string;
  alt: string;
  desktop: string;
  mobile: string | null;
  square: string | null;
  hasLink: boolean;
}

interface AdRow {
  id: number;
  advertiser: string;
  title: string;
  imageDesktop: string;
  imageMobile: string;
  imageSquare: string;
  altText: string;
  linkUrl: string;
  placements: unknown;
  priority: number;
}

function placementsOf(v: unknown): AdSlotKey[] {
  return Array.isArray(v) ? v.filter(isAdSlotKey) : [];
}

/** All ads that are active right now (switched on, started, not ended). One query per request. */
const getLiveAds = cache(async function getLiveAds(): Promise<AdRow[]> {
  const now = new Date();
  try {
    const rows = await prisma.advertisement.findMany({
      where: {
        status: 1,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gte: now } }],
      },
      select: {
        id: true,
        advertiser: true,
        title: true,
        imageDesktop: true,
        imageMobile: true,
        imageSquare: true,
        altText: true,
        linkUrl: true,
        placements: true,
        priority: true,
      },
    });
    return rows as AdRow[];
  } catch {
    // Table not created yet, or database unavailable: show no sponsor ads.
    return [];
  }
});

function toPublic(a: AdRow): PublicAd {
  return {
    id: a.id,
    advertiser: a.advertiser,
    alt: a.altText || a.advertiser || a.title,
    desktop: resolveImage(a.imageDesktop) ?? "",
    mobile: resolveImage(a.imageMobile),
    square: resolveImage(a.imageSquare),
    hasLink: Boolean(a.linkUrl),
  };
}

/** Random order where "high priority" ads come up about three times as often. */
function weightedShuffle(rows: AdRow[]): AdRow[] {
  const pool = rows.map((r) => ({ r, key: Math.pow(Math.random(), 1 / (r.priority >= 2 ? 3 : 1)) }));
  return pool.sort((a, b) => b.key - a.key).map((p) => p.r);
}

export interface SlotPayload {
  /** What to show: sponsor ads, or nothing (Google's automatic ads handle the rest of the page). */
  show: "ours" | "none";
  ads: PublicAd[];
  label: string;
}

/** Decides what an ad space shows on this page view. */
export async function getSlotPayload(slot: AdSlotKey): Promise<SlotPayload> {
  const [settings, live] = await Promise.all([getAdSettings(), getLiveAds()]);
  const none: SlotPayload = { show: "none", ads: [], label: settings.label };
  if (settings.slots[slot].mode !== "ours") return none;

  const candidates = weightedShuffle(live.filter((a) => placementsOf(a.placements).includes(slot)));
  const max = AD_SLOTS[slot].kind === "showcase" ? SHOWCASE_MAX : 1;
  const ads = candidates
    .slice(0, max)
    .map(toPublic)
    .filter((a) => a.desktop || a.square);

  return ads.length ? { show: "ours", ads, label: settings.label } : none;
}

/* ─── Validation for admin input ────────────────────────────────────────── */

/** Accepts website links, WhatsApp (wa.me / api.whatsapp.com), phone and email links. */
export function cleanAdLink(raw: unknown): string | null {
  let v = plainText(raw, 500);
  if (!v) return "";
  if (/^(tel|mailto):/i.test(v)) {
    return /^tel:\+?[\d\s()-]{5,20}$/i.test(v) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(v) ? v : null;
  }
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function parseDay(v: unknown, endOfDay: boolean): Date | null {
  const s = String(v ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function adData(body: Record<string, unknown>) {
  const title = plainText(body.title, 255);
  const advertiser = plainText(body.advertiser, 255);
  const imageDesktop = plainText(body.imageDesktop, 255);
  if (!advertiser) return { error: "Advertiser name is required." } as const;
  if (!imageDesktop && !plainText(body.imageSquare, 255))
    return { error: "Please upload at least the desktop banner (or a square image for the showcase)." } as const;

  const linkUrl = cleanAdLink(body.linkUrl);
  if (linkUrl === null)
    return { error: "The link doesn't look right. Use a website address, a wa.me WhatsApp link, tel: or mailto:." } as const;

  const placements = Array.isArray(body.placements) ? [...new Set(body.placements.filter(isAdSlotKey))] : [];
  if (placements.length === 0) return { error: "Choose at least one place for the ad to appear." } as const;

  const startsAt = parseDay(body.startsAt, false) ?? new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z");
  const endsAt = body.endsAt ? parseDay(body.endsAt, true) : null;
  if (body.endsAt && !endsAt) return { error: "End date doesn't look right." } as const;
  if (endsAt && endsAt < startsAt) return { error: "The end date is before the start date." } as const;

  return {
    data: {
      title: title || advertiser,
      advertiser,
      imageDesktop,
      imageMobile: plainText(body.imageMobile, 255),
      imageSquare: plainText(body.imageSquare, 255),
      altText: plainText(body.altText, 255),
      linkUrl,
      placements,
      startsAt,
      endsAt,
      status: body.status ? 1 : 0,
      priority: Number(body.priority) === 2 ? 2 : 1,
    },
  } as const;
}

/* ─── Stats helpers ─────────────────────────────────────────────────────── */

/** Today's date at midnight UTC, the key used in ad_stats. */
export function statDay(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|headless/i;

export function isBot(ua: string | null): boolean {
  return !ua || BOT_UA.test(ua);
}

/** Adds one view or click to today's row for an ad. */
export async function recordAdEvent(adId: number, kind: "views" | "clicks"): Promise<void> {
  const day = statDay();
  const where = { adId_day: { adId, day } };
  const increment = kind === "views" ? { views: { increment: 1 } } : { clicks: { increment: 1 } };
  try {
    await prisma.adStat.upsert({
      where,
      create: { adId, day, views: kind === "views" ? 1 : 0, clicks: kind === "clicks" ? 1 : 0 },
      update: increment,
    });
  } catch {
    // Two requests created today's row at the same moment: add to the row that won.
    try {
      await prisma.adStat.update({ where, data: increment });
    } catch {
      /* ad deleted or table missing: ignore */
    }
  }
}
