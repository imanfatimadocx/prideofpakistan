import { cache } from "react";
import { prisma } from "@/app/lib/prisma";
import { plainText } from "@/app/lib/sanitize";

/** Text of the public "Advertise with Us" page, edited in Admin > Advertising > Settings. */
export interface AdvertisePageContent {
  eyebrow: string;
  heading: string;
  subtext: string;
  intro: string;
  audience: string[];
  email: string;
  whatsapp: string; // digits with country code, e.g. 447700900123
  note: string;
}

const KEY = "page_advertise";

export const ADVERTISE_DEFAULTS: AdvertisePageContent = {
  eyebrow: "Partner With Us",
  heading: "Advertise with Us",
  subtext: "Put your business in front of a proud, engaged Pakistani community in the UK, Pakistan and around the world.",
  intro:
    "Pride of Pakistan showcases outstanding Pakistanis, businesses and products. Our visitors come to be inspired, to discover Pakistani businesses and to connect with their community. Advertising with us puts your brand alongside that story.",
  audience: [
    "Pakistanis in the UK, Pakistan and across the diaspora",
    "Professionals, business owners and community leaders",
    "Families who come for inspiring stories and Pride TV",
    "People looking for trusted Pakistani businesses and products",
  ],
  email: "info@prideofpakistan.com",
  whatsapp: "",
  note: "Every advert is reviewed before it goes live, to keep Pride of Pakistan family-friendly. Prices depend on the space and how long your campaign runs. Contact us for a quote.",
};

function normalise(raw: unknown): AdvertisePageContent {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = ADVERTISE_DEFAULTS;
  const audience = Array.isArray(r.audience)
    ? r.audience.map((a) => plainText(a, 200)).filter(Boolean).slice(0, 10)
    : d.audience;
  const email = plainText(r.email, 254);
  return {
    eyebrow: plainText(r.eyebrow, 80) || d.eyebrow,
    heading: plainText(r.heading, 120) || d.heading,
    subtext: plainText(r.subtext, 400) || d.subtext,
    intro: plainText(r.intro, 2000) || d.intro,
    audience: audience.length ? audience : d.audience,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : d.email,
    whatsapp: String(r.whatsapp ?? "").replace(/\D/g, "").slice(0, 15),
    note: plainText(r.note, 1000) || d.note,
  };
}

export const getAdvertisePage = cache(async function getAdvertisePage(): Promise<AdvertisePageContent> {
  try {
    const row = await prisma.pageContent.findUnique({ where: { page: KEY } });
    return row ? normalise(row.content) : ADVERTISE_DEFAULTS;
  } catch {
    return ADVERTISE_DEFAULTS;
  }
});

export async function saveAdvertisePage(raw: unknown): Promise<AdvertisePageContent> {
  const page = normalise(raw);
  const content = JSON.parse(JSON.stringify(page));
  await prisma.pageContent.upsert({
    where: { page: KEY },
    create: { page: KEY, content },
    update: { content },
  });
  return page;
}
