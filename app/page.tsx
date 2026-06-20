import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import HeroCarousel, { HeroSlide } from '@/app/components/home/HeroCarousel'
import WhoIsWhoSection, { ProfileCard } from '@/app/components/home/WhoisWhoSection'
import CitiesSection, { CityCard } from '@/app/components/home/CitiesSection'
import BusinessSection, { BizCard } from '@/app/components/home/BusinessSection'
import ProductsSection, { ProductCard } from '@/app/components/home/ProductsSection'
import PrideTVSection, { VideoCard } from '@/app/components/home/PrideTVSection'
import NewsStrip, { NewsItem } from '@/app/components/home/NewsStrip'

// ─── Fetch helpers ──────────────────────────────────────────

const URDU_TAGLINES = ['فخرِ پاکستان', 'پاکستان زندہ باد', 'ہمارا پاکستان', 'شان پاکستان', 'مادر وطن']

async function getHeroSlides(): Promise<HeroSlide[]> {
  const rows = await prisma.hallOfFame.findMany({
    where: { status: 1, feature: 1 },
    orderBy: { id: 'desc' },
    take: 5,
  })

  return rows.map((p, i) => ({
    id: p.id,
    name: p.title ?? 'Pride of Pakistan',
    title: p.Profession ?? 'Pakistani Icon',
    desc: (p.shortdesc ?? '').replace(/<[^>]*>/g, '').slice(0, 200),
    label: 'Who Is Who',
    image: p.image
      ? `/uploads/${p.image}`
      : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    urdu: URDU_TAGLINES[i % URDU_TAGLINES.length],
    city: p.City,
  }))
}

async function getFeaturedProfiles(): Promise<ProfileCard[]> {
  const rows = await prisma.hallOfFame.findMany({
    where: { status: 1 },
    orderBy: { id: 'desc' },
    take: 5,
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title ?? 'Unknown',
    Profession: r.Profession,
    City: r.City,
    Country: r.Country,
    image: r.image ? `/uploads/${r.image}` : null,
    shortdesc: r.shortdesc ?? '',
  }))
}

const CITY_META: Record<string, { tag: string; meta: string; bgColor: string; imageUrl: string }> = {
  Islamabad: {
    tag: 'Capital',
    meta: 'Federal Capital · Population 1.1M',
    bgColor: '#2d5a3d',
    imageUrl: '/cities/islamabad.jpg',
  },
  Lahore: {
    tag: 'Cultural Hub',
    meta: 'Punjab · 13M population',
    bgColor: '#3d5c3a',
    imageUrl: '/cities/lahore.jpg',
  },
  Karachi: {
    tag: 'Metropolis',
    meta: 'Sindh · Financial Capital',
    bgColor: '#2a4a5e',
    imageUrl: '/cities/karachi.jpg',
  },
  Peshawar: {
    tag: 'Historic',
    meta: 'KPK · Gateway to the North',
    bgColor: '#5e3a2a',
    imageUrl: '/cities/peshawar.jpg',
  },
  Quetta: {
    tag: 'Gateway',
    meta: 'Balochistan · Provincial Capital',
    bgColor: '#3a3d5e',
    imageUrl: '/cities/quetta.jpg',
  },
}

async function getCities(): Promise<CityCard[]> {
  const rows = await prisma.city.findMany({ take: 5, orderBy: { id: 'asc' } })

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    ...(CITY_META[r.name] ?? {
      tag: 'City',
      meta: 'Pakistan',
      bgColor: '#2d5a3d',
      imageUrl: '/cities/default.jpg',
    }),
  }))
}

async function getBusinesses(): Promise<BizCard[]> {
  const rows = await prisma.business.findMany({
    where: { status: 1, feature: 1 },
    orderBy: { id: 'desc' },
    take: 5,
  })

  return rows.map((r) => ({
    id: r.id,
    company_name: r.company_name,
    shortdesc: r.shortdesc,
    city: r.city,
    country: r.country,
    image: r.image ? `/uploads/${r.image}` : null,
  }))
}

async function getProducts(): Promise<ProductCard[]> {
  const rows = await prisma.pakProduct.findMany({
    where: { status: 1 },
    orderBy: { id: 'desc' },
    take: 8,
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    city: r.City,
    image: r.image ? `/uploads/${r.image}` : null,
    shortdesc: r.shortdesc as string,
  }))
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

// ─── Page ──────────────────────────────────────────────────

const STATIC_SLIDES: HeroSlide[] = [
  {
    id: 0, name: 'Dr. Abdus Salam', title: 'Nobel Laureate — Physics',
    desc: "Pakistan's first Nobel Prize winner whose contributions to the Standard Model of particle physics changed our understanding of the universe.",
    label: 'Who Is Who', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    urdu: 'فخرِ پاکستان',
  },
]

const FALLBACK_CITIES: CityCard[] = [
  { id: 1, name: 'Islamabad', tag: 'Capital', meta: 'Federal Capital · 1.1M', bgColor: '#2d5a3d', imageUrl: '/uploads/cities/islamabad.jpg' },
  { id: 2, name: 'Lahore', tag: 'Cultural Hub', meta: 'Punjab · 13M', bgColor: '#3d5c3a', imageUrl: '/uploads/cities/lahore.jpg' },
  { id: 3, name: 'Karachi', tag: 'Metropolis', meta: 'Sindh · Financial Capital', bgColor: '#2a4a5e', imageUrl: '/uploads/cities/karachi.jpg' },
  { id: 4, name: 'Peshawar', tag: 'Historic', meta: 'KPK · Gateway to North', bgColor: '#5e3a2a', imageUrl: '/uploads/cities/peshawar.jpg' },
  { id: 5, name: 'Quetta', tag: 'Gateway', meta: 'Balochistan', bgColor: '#3a3d5e', imageUrl: '/uploads/cities/quetta.jpg' },
]

export default async function HomePage() {
  const [heroR, profilesR, citiesR, bizR, productsR, videosR, newsR] = await Promise.allSettled([
    getHeroSlides(),
    getFeaturedProfiles(),
    getCities(),
    getBusinesses(),
    getProducts(),
    getVideos(),
    getNews(),
  ])

  const slides   = heroR.status     === 'fulfilled' && heroR.value.length     ? heroR.value     : STATIC_SLIDES
  const profiles = profilesR.status === 'fulfilled' ? profilesR.value : []
  const cities   = citiesR.status   === 'fulfilled' && citiesR.value.length   ? citiesR.value   : FALLBACK_CITIES
  const bizs     = bizR.status      === 'fulfilled' ? bizR.value      : []
  const products = productsR.status === 'fulfilled' ? productsR.value : []
  const videos   = videosR.status   === 'fulfilled' ? videosR.value   : []
  const news     = newsR.status     === 'fulfilled' ? newsR.value     : []

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <HeroCarousel slides={slides} />
        {profiles.length > 0 && <WhoIsWhoSection profiles={profiles} />}
        <CitiesSection cities={cities} />
        <BusinessSection businesses={bizs} />
        <ProductsSection products={products} />
        {news.length > 0 && <NewsStrip news={news} />}
        <PrideTVSection videos={videos} comingSoon={videos.length === 0} />
      </main>
      <Footer />
    </>
  )
}