import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
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

async function getLatestNews3(): Promise<{ id: number; title: string; shortdesc: string; smallimage: string | null; date_time: Date }[]> {
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

async function getLatestUserStories(): Promise<
  {
    id: number;
    title: string;
    shortdesc: string;
    authorName: string;
    image: string | null;
    createdAt: Date;
  }[]
> {
  try {
    const rows = await prisma.userStory.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        shortdesc: true,
        authorName: true,
        image: true,
        createdAt: true,
      },
    });
    return rows.map((r) => ({
      ...r,
      image: r.image ? resolveImage(r.image) : null,
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
export default async function HomePage() {
  const [
    profilesR,
    bizR,
    productsR,
    videosR,
    newsR,
    potdR,
    featured6R,
    userStoriesR,
  ] = await Promise.allSettled([
    getProfilesAndCategories(),
    getFeatured6Businesses(),
    getFeatured6Products(),
    getVideos(),
    getLatestNews3(),
    getProfileOfTheDay(),
    getFeatured6(),
    getLatestUserStories(), // ← new
  ]);

  const userStories =
    userStoriesR.status === "fulfilled" ? userStoriesR.value : [];

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
        {/* Latest News */}
        {news.length > 0 && (
          <section className="py-12 border-t bg-white sm:py-16 lg:py-20 border-border">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
                    Updates
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">
                    Latest News
                  </h2>
                  <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
                </div>
                <Link
                  href="/news"
                  className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="no-underline group"
                  >
                    {/* Plain image — no card */}
                    <div
                      className="w-full overflow-hidden rounded-lg"
                      style={{ aspectRatio: "600/350" }}
                    >
                      {item.smallimage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.smallimage}
                          alt={item.title}
                          className="w-full h-full object-fit rounded-lg object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-green/10 flex items-center justify-center">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-green/40"
                          >
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Caption — no background */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold tracking-[.12em] uppercase text-gold font-body mb-1.5">
                        {new Date(item.date_time).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="font-display text-base font-bold text-green leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      {item.shortdesc && (
                        <p className="text-xs text-ink-muted font-body leading-relaxed line-clamp-2">
                          {item.shortdesc}
                        </p>
                      )}
                      <p className="text-[11px] font-semibold text-gold font-body mt-2">
                        Read more →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Your Stories */}
        {userStories.length > 0 && (
          <section className="py-12 border-t bg-cream sm:py-16 lg:py-20 border-border">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-2 font-body">
                    Community
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-green leading-tight">
                    Your Stories
                  </h2>
                  <div className="w-12 h-[3px] bg-gold mt-3 rounded" />
                </div>
                <Link
                  href="/your-stories"
                  className="text-[13px] font-semibold text-gold no-underline flex items-center gap-1.5 hover:gap-3 transition-all font-body whitespace-nowrap"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {userStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/your-stories/${story.id}`}
                    className="no-underline group"
                  >
                    {/* Plain image — no card */}
                    <div
                      className="w-full overflow-hidden rounded-lg"
                      style={{ aspectRatio: "600/350" }}
                    >
                      {story.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-fit rounded-lg object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-green/10 flex items-center justify-center">
                          <span className="font-display text-4xl font-bold text-green/30">
                            {story.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Caption — no background */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold tracking-[.12em] uppercase text-gold font-body mb-1.5">
                        By {story.authorName} ·{" "}
                        {new Date(story.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="font-display text-base font-bold text-green leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-1">
                        {story.title}
                      </h3>
                      {story.shortdesc && (
                        <p className="text-xs text-ink-muted font-body leading-relaxed line-clamp-2">
                          {story.shortdesc}
                        </p>
                      )}
                      <p className="text-[11px] font-semibold text-gold font-body mt-2">
                        Read more →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        <PrideTVSection videos={videos} comingSoon={videos.length === 0} />
      </main>
      <Footer />
    </>
  );
}

