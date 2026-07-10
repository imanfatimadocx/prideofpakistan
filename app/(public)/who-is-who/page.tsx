import { prisma } from "@/app/lib/prisma"
import Topbar from "@/app/components/layout/Topbar"
import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import WhoIsWhoPageClient from "./WhoIsWhoPageClient"

export interface Profile {
  id: number
  title: string
  Profession: string | null
  City: string | null
  Country: string | null
  image: string | null
  shortdesc: string | null
  categoryid: number | null
  categoryname: string | null
}

export interface Category {
  categoryid: number
  categoryname: string
  count: number
}

async function getData(): Promise<{ profiles: Profile[]; categories: Category[] }> {
  // Sequential — avoids connection pool exhaustion on Supabase free tier
  const cats = await prisma.hallCategory.findMany({
    where: { status: 1 },
    orderBy: { categoryname: "asc" },
  })

  const rows = await prisma.hallOfFame.findMany({
    where: { status: 1 },
    orderBy: { title: "asc" },
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

  const catMap = new Map(cats.map((c) => [c.categoryid, c.categoryname]))

  const profiles: Profile[] = rows.map((r) => ({
    id: r.id,
    title: r.title ?? "Unknown",
    Profession: r.Profession,
    City: r.City,
    Country: r.Country,
    image: r.image ? `/uploads/${r.image}` : null,
    shortdesc: r.shortdesc,
    categoryid: r.categoryid,
    categoryname: r.categoryid ? (catMap.get(r.categoryid) ?? null) : null,
  }))

  const categories: Category[] = cats.map((c) => ({
    categoryid: c.categoryid,
    categoryname: c.categoryname,
    count: rows.filter((r) => r.categoryid === c.categoryid).length,
  }))

  return { profiles, categories }
}

export const metadata = {
  title: "Who Is Who | Pride of Pakistan",
  description: "Browse outstanding Pakistanis across all fields.",
}

export default async function WhoIsWhoPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { profiles, categories } = await getData()
  const { category } = await searchParams
  const defaultCategory = category ? Number(category) : null

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <WhoIsWhoPageClient
          profiles={profiles}
          categories={categories}
          defaultCategoryId={defaultCategory}
        />
      </main>
      <Footer />
    </>
  )
}