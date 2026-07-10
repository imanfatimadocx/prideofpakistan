import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import HeroSection from '@/app/components/home/HeroCarousel'
import WhoIsWhoSection, { ProfileCard, CategoryCard } from '@/app/components/home/WhoisWhoSection'
import CitiesSection, { CityCard } from '@/app/components/home/CitiesSection'
import BusinessSection, { BizCard } from '@/app/components/home/BusinessSection'
import ProductsSection, { ProductCard } from '@/app/components/home/ProductsSection'
import PrideTVSection, { VideoCard } from '@/app/components/home/PrideTVSection'
import NewsStrip, { NewsItem } from '@/app/components/home/NewsStrip'

// ─── Category name maps ──────────────────────────────────────

const PRODUCT_CATEGORY_NAMES: Record<number, string> = {
  1:  'Food & Agriculture',
  2:  'Textiles & Clothing',
  3:  'Handicrafts',
  4:  'Sports Goods',
  5:  'Leather Goods',
  6:  'Jewellery & Gems',
  7:  'Surgical Instruments',
  8:  'Ceramics & Pottery',
  9:  'Rugs & Carpets',
  10: 'Technology',
}

const BUSINESS_CATEGORY_NAMES: Record<number, string> = {
  1:  'Property',
  2:  'Importers and Exporters',
  3:  'Hospitality',
  4:  'Furniture & Furnishings',
  5:  'Cash & Carries and Wholesale',
  6:  'Accountants',
  7:  'IT / Computing',
  8:  'Electrical Goods',
  9:  'Travel and Tourism',
  10: 'Jobs',
  11: 'Hajj & Umrah Operators',
  12: 'Photography & Videography',
  13: 'Restaurants / Take Aways',
  14: 'Charities',
  15: 'Driving Schools',
  16: 'Education',
  17: 'Hospitals',
}

// ─── Fetch helpers ───────────────────────────────────────────

async function getFeaturedProfiles(): Promise<{
  profiles: ProfileCard[]
  categories: CategoryCard[]
}> {
  const cats = await prisma.hallCategory.findMany({
    where: { status: 1 },
  })

  const rows = await prisma.hallOfFame.findMany({
    where: { status: 1 },
    orderBy: { id: 'desc' },
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
  })

  const profiles: ProfileCard[] = rows.map((r) => ({
    id: r.id,
    title: r.title ?? 'Unknown',
    Profession: r.Profession,
    City: r.City,
    Country: r.Country,
    image: r.image ? `/uploads/${r.image}` : null,
    shortdesc: r.shortdesc ?? '',
    categoryid: r.categoryid ?? null,
    categoryname: null,
  }))

  const categories: CategoryCard[] = cats
    .map((c) => ({
      categoryid: c.categoryid,
      categoryname: c.categoryname,
      count: rows.filter((r) => r.categoryid === c.categoryid).length,
    }))
    .filter((c) => c.count > 0)

  return { profiles, categories }
}

const CITY_META: Record<string, { tag: string; meta: string; bgColor: string; imageUrl: string }> = {
  Islamabad: { tag: 'Capital',      meta: 'Federal Capital · Population 1.1M', bgColor: '#2d5a3d', imageUrl: '/cities/islamabad.jpg' },
  Lahore:    { tag: 'Cultural Hub', meta: 'Punjab · 13M population',            bgColor: '#3d5c3a', imageUrl: '/cities/lahore.jpg' },
  Karachi:   { tag: 'Metropolis',   meta: 'Sindh · Financial Capital',           bgColor: '#2a4a5e', imageUrl: '/cities/karachi.jpg' },
  Peshawar:  { tag: 'Historic',     meta: 'KPK · Gateway to the North',         bgColor: '#5e3a2a', imageUrl: '/cities/peshawar.jpg' },
  Quetta:    { tag: 'Gateway',      meta: 'Balochistan · Provincial Capital',    bgColor: '#3a3d5e', imageUrl: '/cities/quetta.jpg' },
}

async function getCities(): Promise<CityCard[]> {
  const rows = await prisma.city.findMany({ take: 5, orderBy: { id: 'asc' } })

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    ...(CITY_META[r.name] ?? { tag: 'City', meta: 'Pakistan', bgColor: '#2d5a3d', imageUrl: '/cities/default.jpg' }),
  }))
}

async function getBusinesses(): Promise<{
  businesses: BizCard[]
  categories: { id: number; name: string; count: number }[]
}> {
  const [featured, all] = await Promise.all([
    prisma.business.findMany({
      where: { status: 1, feature: 1 },
      orderBy: { id: 'desc' },
      take: 6,
      select: {
        id: true,
        company_name: true,
        shortdesc: true,
        city: true,
        country: true,
        image: true,
        busniss_id: true,
      },
    }),
    prisma.business.findMany({
      where: { status: 1 },
      select: { busniss_id: true },
    }),
  ])

  const countMap = new Map<number, number>()
  all.forEach((r) => {
    if (r.busniss_id && r.busniss_id > 0)
      countMap.set(r.busniss_id, (countMap.get(r.busniss_id) ?? 0) + 1)
  })

 const businesses: BizCard[] = featured.map((r) => ({
  id: r.id,
  company_name: r.company_name,
  shortdesc: r.shortdesc,
  city: r.city,
  country: r.country,
  image: r.image ? `/uploads/${r.image}` : null,
  categoryid: r.busniss_id && r.busniss_id > 0 ? r.busniss_id : undefined,
  category: r.busniss_id && r.busniss_id > 0
    ? BUSINESS_CATEGORY_NAMES[r.busniss_id]
    : undefined,
}))
  const categories = Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      id,
      name: BUSINESS_CATEGORY_NAMES[id] ?? `Category ${id}`,
      count,
    }))

  return { businesses, categories }
}

async function getProducts(): Promise<{
  products: ProductCard[]
  categories: { id: number; name: string; count: number }[]
}> {
  const rows = await prisma.pakProduct.findMany({
    where: { status: 1 },
    orderBy: { id: 'desc' },
    take: 8,
    select: {
      id: true,
      title: true,
      City: true,
      image: true,
      shortdesc: true,
      categoryid: true,
    },
  })

  const countMap = new Map<number, number>()
  rows.forEach((r) => {
    countMap.set(r.categoryid, (countMap.get(r.categoryid) ?? 0) + 1)
  })

 const products: ProductCard[] = rows.map((r) => ({
  id: r.id,
  title: r.title,
  city: r.City,
  image: r.image && r.image.trim() !== '' ? `/uploads/${r.image}` : null,
  shortdesc: (r.shortdesc as string) ?? '',
  categoryid: r.categoryid,
  category: PRODUCT_CATEGORY_NAMES[r.categoryid],
}))

  const categories = Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      id,
      name: PRODUCT_CATEGORY_NAMES[id] ?? `Category ${id}`,
      count,
    }))

  return { products, categories }
}

async function getVideos(): Promise<VideoCard[]> {
  const rows = await prisma.video.findMany({
    where: { status: 'active' },
    orderBy: { views: 'desc' },
    take: 6,
  })

  return rows.map((r) => ({
    video_id: Number(r.video_id),
    title: r.title,
    thumb_url: r.thumb_url,
    featured: r.featured,
    views: Number(r.views),
    category: r.category,
  }))
}

async function getNews(): Promise<NewsItem[]> {
  const rows = await prisma.latestNews.findMany({
    where: { status: 1 },
    orderBy: { date_time: 'desc' },
    take: 3,
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    shortdesc: r.shortdesc,
    smallimage: r.smallimage ? `/uploads/${r.smallimage}` : null,
    date_time: r.date_time,
  }))
}

// ─── Fallbacks ───────────────────────────────────────────────

const FALLBACK_CITIES: CityCard[] = [
  { id: 1, name: 'Islamabad', tag: 'Capital',      meta: 'Federal Capital · 1.1M',    bgColor: '#2d5a3d', imageUrl: '/cities/islamabad.jpg' },
  { id: 2, name: 'Lahore',    tag: 'Cultural Hub', meta: 'Punjab · 13M',              bgColor: '#3d5c3a', imageUrl: '/cities/lahore.jpg' },
  { id: 3, name: 'Karachi',   tag: 'Metropolis',   meta: 'Sindh · Financial Capital', bgColor: '#2a4a5e', imageUrl: '/cities/karachi.jpg' },
  { id: 4, name: 'Peshawar',  tag: 'Historic',     meta: 'KPK · Gateway to North',   bgColor: '#5e3a2a', imageUrl: '/cities/peshawar.jpg' },
  { id: 5, name: 'Quetta',    tag: 'Gateway',      meta: 'Balochistan',              bgColor: '#3a3d5e', imageUrl: '/cities/quetta.jpg' },
]

// ─── Page ────────────────────────────────────────────────────

export default async function HomePage() {
  const [profilesR, citiesR, bizR, productsR, videosR, newsR] = await Promise.allSettled([
    getFeaturedProfiles(),
    getCities(),
    getBusinesses(),
    getProducts(),
    getVideos(),
    getNews(),
  ])

  const profilesResult = profilesR.status === 'fulfilled'
    ? profilesR.value
    : { profiles: [], categories: [] }

  const bizResult = bizR.status === 'fulfilled'
    ? bizR.value
    : { businesses: [], categories: [] }

  const productsResult = productsR.status === 'fulfilled'
    ? productsR.value
    : { products: [], categories: [] }

  const profiles    = profilesResult.profiles
  const profileCats = profilesResult.categories
  const cities      = citiesR.status === 'fulfilled' && citiesR.value.length ? citiesR.value : FALLBACK_CITIES
  const bizs        = bizResult.businesses
  const bizCats     = bizResult.categories
  const products    = productsResult.products
  const prodCats    = productsResult.categories
  const videos      = videosR.status === 'fulfilled' ? videosR.value : []
  const news        = newsR.status   === 'fulfilled' ? newsR.value   : []

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <HeroSection />
        {profiles.length > 0 && (
          <WhoIsWhoSection profiles={profiles} categories={profileCats} />
        )}
        <CitiesSection cities={cities} />
        <BusinessSection businesses={bizs} categories={bizCats} />
        <ProductsSection products={products} categories={prodCats} />
        {news.length > 0 && <NewsStrip news={news} />}
        <PrideTVSection videos={videos} comingSoon={videos.length === 0} />
      </main>
      <Footer />
    </>
  )
}