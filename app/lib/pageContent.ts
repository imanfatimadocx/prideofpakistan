import { prisma } from "@/app/lib/prisma";

export interface PageHeroContent {
  eyebrow: string;
  heading: string;
  subtext: string;
  image?: string | null;
}

const FALLBACKS: Record<string, PageHeroContent> = {
  hero: {
    eyebrow: "Celebrating Pakistan",
    heading: "Pride of Pakistan",
    subtext: "Showcasing the best of Pakistan to the world.",
  },
  page_whoiswho: {
    eyebrow: "Hall of Fame",
    heading: "Who Is Who",
    subtext:
      "Discover remarkable Pakistanis who have made their mark on the world.",
  },
  page_products: {
    eyebrow: "Made in Pakistan",
    heading: "Pakistani Products",
    subtext: "Discover the finest products Pakistan has to offer.",
  },
  page_businesses: {
    eyebrow: "Business Directory",
    heading: "Pakistani Businesses",
    subtext: "Join Pakistan's premier business directory.",
  },
  page_news: {
    eyebrow: "Latest News",
    heading: "Latest News",
    subtext: "Stay up to date with the latest from Pride of Pakistan.",
  },
  page_stories: {
    eyebrow: "Community",
    heading: "Your Stories",
    subtext: "Stories shared by Pakistanis from around the world.",
  },
  page_contact: {
    eyebrow: "Get in Touch",
    heading: "Contact Us",
    subtext: "We'd love to hear from you.",
  },
  page_submitprofile: {
    eyebrow: "Join the Hall of Fame",
    heading: "Submit Your Profile",
    subtext: "Share your story with Pakistan.",
  },
  page_listbusiness: {
    eyebrow: "Grow Your Reach",
    heading: "List Your Business",
    subtext: "Join Pakistan's premier business directory.",
  },
  page_pridetv: {
    eyebrow: "Watch",
    heading: "Pride TV",
    subtext: "Watch videos celebrating the best of Pakistan.",
  },
};

export async function getPageContent(
  section: string,
): Promise<PageHeroContent> {
  try {
    const row = await prisma.homepageContent.findUnique({ where: { section } });
    if (!row)
      return FALLBACKS[section] ?? { eyebrow: "", heading: "", subtext: "" };
    const c = row.content as Record<string, string>;
    return {
      eyebrow: c.eyebrow ?? FALLBACKS[section]?.eyebrow ?? "",
      heading: c.heading ?? FALLBACKS[section]?.heading ?? "",
      subtext: c.subtext ?? FALLBACKS[section]?.subtext ?? "",
      image: c.image ?? null,
    };
  } catch {
    return FALLBACKS[section] ?? { eyebrow: "", heading: "", subtext: "" };
  }
}
