import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

interface Biz {
  id: number
  company_name: string
  shortdesc: string
  city: string
  country: string
  image: string | null
}

async function getBusinesses(): Promise<Biz[]> {
  const rows = await prisma.business.findMany({
    where: { status: 1 },
    orderBy: { id: 'desc' },
    take: 60,
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

export default async function BusinessPage() {
  let businesses: Biz[] = []
  try {
    businesses = await getBusinesses()
  } catch {
    businesses = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Business Directory"
          title="Pakistani Businesses"
          subtitle="Discover companies, entrepreneurs, and brands built by Pakistanis at home and around the world."
        />

        <section className="py-12 bg-cream sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex justify-end mb-8">
              <Link
                href="/list-business"
                className="bg-gold text-white px-5 py-2.5 rounded-md font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
              >
                List Your Business →
              </Link>
            </div>

            {businesses.length === 0 ? (
              <p className="py-12 text-center text-ink-muted font-body">
                No businesses listed yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
                {businesses.map((biz) => (
                  <Link
                    key={biz.id}
                    href={`/business/${biz.id}`}
                    className="flex flex-col p-6 no-underline transition-all duration-300 bg-white border border-border rounded-xl hover:border-gold hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center mb-4 overflow-hidden text-2xl w-14 h-14 bg-gold-pale rounded-xl">
                      {biz.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={biz.image} alt={biz.company_name} className="object-cover w-full h-full" />
                      ) : (
                        <span>🏢</span>
                      )}
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-ink-dark mb-1.5 leading-tight">
                      {biz.company_name}
                    </h3>
                    <p className="text-xs text-ink-muted mb-2.5 font-body">
                      📍 {biz.city}, {biz.country}
                    </p>
                    <p className="text-[13px] text-ink-muted leading-relaxed font-body flex-1 line-clamp-3">
                      {biz.shortdesc}
                    </p>
                    <span className="mt-4 text-xs text-gold flex items-center gap-1.5 font-semibold font-body">
                      View Profile →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}