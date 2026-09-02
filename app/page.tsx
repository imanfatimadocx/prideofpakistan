import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import HeroSection from "@/app/components/home/HeroCarousel";
import WhoIsWhoSection, {
  ProfileCard,
  CategoryCard,
} from "@/app/components/home/WhoisWhoSection";
import BusinessSection, {
  BizCard,
} from "@/app/components/home/BusinessSection";
import ProductsSection, {
  ProductCard,
} from "@/app/components/home/ProductsSection";
import PrideTVSection, {
  VideoCard,
} from "@/app/components/home/PrideTVSection";
import NewsStrip, { NewsItem } from "@/app/components/home/NewsStrip";

export const revalidate = 86400;

const PRODUCT_CATEGORY_NAMES: Record<number, string> = {
  1: "Food & Agriculture",
  2: "Textiles & Clothing",
  3: "Handicrafts",
  4: "Sports Goods",
  5: "Leather Goods",
  6: "Jewellery & Gems",
  7: "Surgical Instruments",
  8: "Ceramics & Pottery",
  9: "Rugs & Carpets",
  10: "Technology",
};

function resolveImage(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  if (image.startsWith("uploads/")) return `/${image}`;
  return `/uploads/${image}`;
}

function mapToProfileCard(r: {
  id: number;
  title: string | null;
  Profession: string | null;
  City: string | null;
  Country: string | null;
  image: string | null;
  shortdesc: string | null;
  categoryid: number | null;
}): ProfileCard {
  return {
    id: r.id,
    title: r.title ?? "",
    Profession: r.Profession,
    City: r.City,
    Country: r.Country,
    image: resolveImage(r.image),
    shortdesc: r.shortdesc ?? "",
    categoryid: r.categoryid ?? null,
    categoryname: null,
  };
}

async function getProfileOfTheDay(): Promise<ProfileCard | null> {
  try {
    const featured = await prisma.hallOfFame.findMany({
      where: { feature: 1, status: 1 },
      orderBy: { id: "asc" },
      select: {
        id: true,
        title: true,
        Profession: true,
        City: true,
        Country: true,
        image: true,
        shortdesc: true,
        categoryid: true,
      },
    });
    if (featured.length === 0) return null;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    const potdIndex = dayOfYear % featured.length;
    const r = featured[potdIndex];
    if (!r) return null;
    return mapToProfileCard(r);
  } catch {
    return null;
  }
}

async function getFeatured6(): Promise<ProfileCard[]> {
  try {
    const featured = await prisma.hallOfFame.findMany({
      where: { feature: 1, status: 1 },
      orderBy: { id: "asc" },
      select: {
        id: true,
        title: true,
        Profession: true,
        City: true,
        Country: true,
        image: true,
        shortdesc: true,
        categoryid: true,
      },
    });
    if (featured.length === 0) return [];
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    const potdIndex = dayOfYear % featured.length;
    const picked: typeof featured = [];
    for (let i = 1; i <= Math.min(6, featured.length - 1); i++) {
      const r = featured[(potdIndex + i) % featured.length];
      if (r) picked.push(r);
    }
    if (picked.length === 0 && featured.length > 0) {
      picked.push(featured[potdIndex]);
    }
    return picked.map(mapToProfileCard);
  } catch {
    return [];
  }
}

async function getProfilesAndCategories(): Promise<{
  profiles: ProfileCard[];
  categories: CategoryCard[];
}> {
  try {
    const cats = await prisma.hallCategory.findMany({ where: { status: 1 } });
    const rows = await prisma.hallOfFame.findMany({
      where: { status: 1 },
      orderBy: { id: "desc" },
      take: 100,
      select: {
        id: true,
        title: true,
        Profession: true,
        City: true,
        Country: true,
        image: true,
        shortdesc: true,
        categoryid: true,
      },
    });
    const profiles: ProfileCard[] = rows.map(mapToProfileCard);
    const categories: CategoryCard[] = cats
      .map((c) => ({
        categoryid: c.categoryid,
        categoryname: c.categoryname,
        count: rows.filter((r) => r.categoryid === c.categoryid).length,
      }))
      .filter((c) => c.count > 0);
    return { profiles, categories };
  } catch {
    return { profiles: [], categories: [] };
  }
}

async function getFeatured6Businesses(): Promise<BizCard[]> {
  try {
    let featured = await prisma.business.findMany({
      where: { status: 1, feature: 1 },
      orderBy: { id: "asc" },
      select: {
        id: true,
        company_name: true,
        shortdesc: true,
        city: true,
        country: true,
        image: true,
        category_id: true,
      },
    });

    // Fallback — if no featured, show latest 6
    if (featured.length === 0) {
      featured = await prisma.business.findMany({
        where: { status: 1 },
        orderBy: { id: "desc" },
        take: 6,
        select: {
          id: true,
          company_name: true,
          shortdesc: true,
          city: true,
          country: true,
          image: true,
          category_id: true,
        },
      });
    }

    if (featured.length === 0) return [];

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    const startIdx = (dayOfYear * 6) % featured.length;
    const picked: typeof featured = [];
    for (let i = 0; i < Math.min(6, featured.length); i++) {
      picked.push(featured[(startIdx + i) % featured.length]);
    }

    return picked.map((r) => ({
      id: r.id,
      company_name: r.company_name,
      shortdesc: r.shortdesc,
      city: r.city,
      country: r.country,
      image: resolveImage(r.image || null),
    }));
  } catch {
    return [];
  }
}

async function getFeatured6Products(): Promise<ProductCard[]> {
  try {
    let featured = await prisma.pakProduct.findMany({
      where: { status: 1, feature: 1 },
      orderBy: { id: "asc" },
      select: {
        id: true,
        title: true,
        City: true,
        image: true,
        shortdesc: true,
        categoryid: true,
      },
    });

    // Fallback — if no featured, show latest 6
    if (featured.length === 0) {
      featured = await prisma.pakProduct.findMany({
        where: { status: 1 },
        orderBy: { id: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          City: true,
          image: true,
          shortdesc: true,
          categoryid: true,
        },
      });
    }

    if (featured.length === 0) return [];

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    const startIdx = (dayOfYear * 6) % featured.length;
    const picked: typeof featured = [];
    for (let i = 0; i < Math.min(6, featured.length); i++) {
      picked.push(featured[(startIdx + i) % featured.length]);
    }

    return picked.map((r) => ({
      id: r.id,
      title: r.title,
      city: r.City,
      image: r.image && r.image.trim() !== "" ? resolveImage(r.image) : null,
      shortdesc: (r.shortdesc as string) ?? "",
      categoryid: r.categoryid,
      category: PRODUCT_CATEGORY_NAMES[r.categoryid],
    }));
  } catch {
    return [];
  }
}

async function getVideos(): Promise<VideoCard[]> {
  try {
    const rows = await prisma.video.findMany({
      where: { status: "active" },
      orderBy: { views: "desc" },
      take: 8,
    });
    return rows.map((r) => ({
      video_id: Number(r.video_id),
      title: r.title,
      thumb_url: r.thumb_url,
      featured: r.featured,
      views: Number(r.views),
      video_embed_code: r.video_embed_code,
      category: r.category,
    }));
  } catch {
    return [];
  }
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const rows = await prisma.latestNews.findMany({
      where: { status: 1 },
      orderBy: { date_time: "desc" },
      take: 3,
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      shortdesc: r.shortdesc,
      smallimage: r.smallimage ? resolveImage(r.smallimage) : null,
      date_time: r.date_time,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [profilesR, bizR, productsR, videosR, newsR, potdR, featured6R] =
    await Promise.allSettled([
      getProfilesAndCategories(),
      getFeatured6Businesses(),
      getFeatured6Products(),
      getVideos(),
      getNews(),
      getProfileOfTheDay(),
      getFeatured6(),
    ]);

  const profilesResult =
    profilesR.status === "fulfilled"
      ? profilesR.value
      : { profiles: [], categories: [] };
  const profiles = profilesResult.profiles;
  const profileCats = profilesResult.categories;
  const bizs = bizR.status === "fulfilled" ? (bizR.value ?? []) : [];
  const products =
    productsR.status === "fulfilled" ? (productsR.value ?? []) : [];
  const videos = videosR.status === "fulfilled" ? videosR.value : [];
  const news = newsR.status === "fulfilled" ? newsR.value : [];
  const profileOfTheDay =
    potdR.status === "fulfilled" ? (potdR.value ?? null) : null;
  const featuredProfiles =
    featured6R.status === "fulfilled" ? (featured6R.value ?? []) : [];

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <HeroSection />
        {profiles.length > 0 && (
          <WhoIsWhoSection
            profiles={profiles}
            categories={profileCats}
            featuredProfiles={featuredProfiles}
            profileOfTheDay={profileOfTheDay}
          />
        )}
        <ProductsSection products={products} />
        <BusinessSection businesses={bizs} />
        {news.length > 0 && <NewsStrip news={news} />}
        <PrideTVSection videos={videos} comingSoon={videos.length === 0} />
      </main>
      <Footer />
    </>
  );
}
