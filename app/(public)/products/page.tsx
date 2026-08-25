import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import ProductsPageClient from './ProductsPageClient'

export const revalidate = 60

export interface ProductItem {
  id: number
  title: string
  city: string
  image: string | null
  shortdesc: string
  categoryid: number
  categoryname: string
}

export interface ProductCategory {
  id: number
  name: string
  count: number
}

// Named categories - update these IDs to match what's in your pakproducts table
// Check Prisma Studio → PakProduct to see which categoryid numbers are used
const PRODUCT_CATEGORY_NAMES: Record<number, string> = {
  1: 'Food & Agriculture',
  2: 'Textiles & Clothing',
  3: 'Handicrafts',
  4: 'Sports Goods',
  5: 'Leather Goods',
  6: 'Jewellery & Gems',
  7: 'Surgical Instruments',
  8: 'Ceramics & Pottery',
  9: 'Rugs & Carpets',
  10: 'Technology',
}

async function getData() {
  const rows = await prisma.pakProduct.findMany({
    where: { status: 1 },
    orderBy: { title: 'asc' },
    select: {
      id: true,
      title: true,
      City: true,
      image: true,
      shortdesc: true,
      categoryid: true,
    },
  })

  const products: ProductItem[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    city: r.City,
    image: r.image && r.image.trim() !== '' ? `/uploads/${r.image}` : null,
    shortdesc: (r.shortdesc as string) ?? '',
    categoryid: r.categoryid,
    categoryname: PRODUCT_CATEGORY_NAMES[r.categoryid] ?? `Category ${r.categoryid}`,
  }))

  // Build category list from actual data
  const catCountMap = new Map<number, number>()
  rows.forEach((r) => {
    catCountMap.set(r.categoryid, (catCountMap.get(r.categoryid) ?? 0) + 1)
  })

  const categories: ProductCategory[] = Array.from(catCountMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([id, count]) => ({
      id,
      name: PRODUCT_CATEGORY_NAMES[id] ?? `Category ${id}`,
      count,
    }))

  return { products, categories }
}

export const metadata = {
  title: 'Pakistani Products | Pride of Pakistan',
  description: 'Discover products and crafts from Pakistan.',
}

export default async function ProductsPage() {
  let products: ProductItem[] = []
  let categories: ProductCategory[] = []

  try {
    const data = await getData()
    products = data.products
    categories = data.categories
  } catch (e) {
    console.error('Products fetch error:', e)
    products = []
    categories = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <ProductsPageClient products={products} categories={categories} />
      </main>
      <Footer />
    </>
  )
}