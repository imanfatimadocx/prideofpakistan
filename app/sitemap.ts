import type { MetadataRoute } from "next";
import { prisma } from "@/app/lib/prisma";

// Built fresh on each request, so new profiles, listings and posts appear
// automatically. Only published (approved) items are listed.
export const dynamic = "force-dynamic";

const BASE = "https://prideofpakistan.com";

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/who-is-who", priority: 0.9, changeFrequency: "daily" },
  { path: "/business", priority: 0.8, changeFrequency: "weekly" },
  { path: "/products", priority: 0.8, changeFrequency: "weekly" },
  { path: "/discussion-forum", priority: 0.8, changeFrequency: "daily" },
  { path: "/your-stories", priority: 0.8, changeFrequency: "weekly" },
  { path: "/pride-tv", priority: 0.7, changeFrequency: "weekly" },
  { path: "/pride-team", priority: 0.5, changeFrequency: "monthly" },
  { path: "/our-sponsors", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/mission", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/terms-of-use", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // If the database can't be reached, still return the main pages.
  try {
    const [profiles, businesses, products, posts, stories, videos, team] = await Promise.all([
      prisma.hallOfFame.findMany({ where: { status: 1 }, select: { id: true } }),
      prisma.business.findMany({ where: { status: 1 }, select: { id: true } }),
      prisma.pakProduct.findMany({ where: { status: 1 }, select: { id: true } }),
      prisma.latestNews.findMany({ where: { status: 1 }, select: { id: true } }),
      prisma.userStory.findMany({ where: { status: "approved" }, select: { id: true } }),
      prisma.video.findMany({ where: { status: "active" }, select: { video_id: true } }),
      prisma.prideTeam.findMany({ where: { status: 1 }, select: { id: true } }),
    ]);

    const add = (prefix: string, ids: (number | bigint)[], priority: number) => {
      for (const id of ids) entries.push({ url: `${BASE}${prefix}/${id}`, changeFrequency: "monthly", priority });
    };
    add("/who-is-who", profiles.map((x) => x.id), 0.7);
    add("/business", businesses.map((x) => x.id), 0.6);
    add("/products", products.map((x) => x.id), 0.6);
    add("/discussion-forum", posts.map((x) => x.id), 0.6);
    add("/your-stories", stories.map((x) => x.id), 0.6);
    add("/pride-tv", videos.map((x) => x.video_id), 0.5);
    add("/pride-team", team.map((x) => x.id), 0.4);
  } catch (err) {
    console.error("Sitemap: could not load items from the database", err);
  }

  return entries;
}
