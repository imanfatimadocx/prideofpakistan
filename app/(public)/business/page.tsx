import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import BusinessPageClient from './BusinessPageClient'

export const revalidate = 60

export interface BusinessItem {
  id: number
  company_name: string
  shortdesc: string
  city: string
  country: string
  image: string | null
  categoryid: number | null
  categoryname: string | null
}

export interface BusinessCategory {
  id: number
  name: string
  count: number
}

// Hardcoded categories from your DB since busniss_id=0 on all businesses
// These match exactly what's in your BusinessCategory table
const BUSINESS_CATEGORIES: BusinessCategory[] = [
  { id: 1,  name: 'Property',                  count: 0 },
  { id: 2,  name: 'Importers and Exporters',    count: 0 },
  { id: 3,  name: 'Hospitality',                count: 0 },
  { id: 4,  name: 'Furniture & Furnishings',    count: 0 },
  { id: 5,  name: 'Cash & Carries and Wholesale', count: 0 },
  { id: 6,  name: 'Accountants',                count: 0 },
  { id: 7,  name: 'IT / Computing',             count: 0 },
  { id: 8,  name: 'Electrical Goods',           count: 0 },
  { id: 9,  name: 'Travel and Tourism',         count: 0 },
  { id: 10, name: 'Jobs',                       count: 0 },
  { id: 11, name: 'Hajj & Umrah Operators',     count: 0 },
  { id: 12, name: 'Photography & Videography',  count: 0 },
  { id: 13, name: 'Restaurants / Take Aways',   count: 0 },
  { id: 14, name: 'Charities',                  count: 0 },
  { id: 15, name: 'Driving Schools',            count: 0 },
  { id: 16, name: 'Education',                  count: 0 },
  { id: 17, name: 'Hospitals',                  count: 0 },
]

async function getData() {
  const rows = await prisma.business.findMany({
    where: { status: 1 },
    orderBy: { company_name: 'asc' },
    select: {
      id: true,
      company_name: true,
      shortdesc: true,
      city: true,
      country: true,
      image: true,
      busniss_id: true,
    },
  })

  const businesses: BusinessItem[] = rows.map((r) => ({
    id: r.id,
    company_name: r.company_name,
    shortdesc: r.shortdesc,
    city: r.city,
    country: r.country,
    image: r.image ? `/uploads/${r.image}` : null,
    categoryid: r.busniss_id && r.busniss_id > 0 ? r.busniss_id : null,
    categoryname: r.busniss_id && r.busniss_id > 0
      ? (BUSINESS_CATEGORIES.find((c) => c.id === r.busniss_id)?.name ?? null)
      : null,
  }))

  // Count businesses per category
  const categories = BUSINESS_CATEGORIES.map((c) => ({
    ...c,
    count: rows.filter((r) => r.busniss_id === c.id).length,
  })).filter((c) => c.count > 0) // only show categories that have businesses

  return { businesses, categories }
}

export const metadata = {
  title: 'Business Directory | Pride of Pakistan',
  description: 'Discover Pakistani businesses at home and around the world.',
}

export default async function BusinessPage() {
  let businesses: BusinessItem[] = []
  let categories: BusinessCategory[] = []

  try {
    const data = await getData()
    businesses = data.businesses
    categories = data.categories
  } catch {
    businesses = []
    categories = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <BusinessPageClient businesses={businesses} categories={categories} />
      </main>
      <Footer />
    </>
  )
}