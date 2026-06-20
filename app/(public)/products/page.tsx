import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

interface Product {
  id: number
  title: string
  city: string
  image: string | null
}

const PRODUCT_EMOJIS = ['🥭','🌹','⚽','🍵','🔮','🌾','💎','🎨']

async function getProducts(): Promise<Product[]> {
  const rows = await prisma.pakProduct.findMany({
    where: { status: 1 },
    orderBy: { id: 'desc' },
    take: 60,
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    city: r.City,
    image: r.image ? `/uploads/${r.image}` : null,
  }))
}

export default async function ProductsPage() {
  let products: Product[] = []
  try {
    products = await getProducts()
  } catch {
    products = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Made in Pakistan"
          title="Pakistani Products"
          subtitle="From world-famous mangoes to handcrafted textiles — explore the goods that carry Pakistan's name across the globe."
        />

        <section className="py-12 bg-white sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {products.length === 0 ? (
              <p className="py-12 text-center text-ink-muted font-body">
                No products available yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
                {products.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="block overflow-hidden no-underline transition-all duration-300 bg-white border rounded-lg border-border hover:-translate-y-1 hover:shadow-xl hover:border-gold group"
                  >
                    <div className="w-full h-32 sm:h-40 lg:h-[180px] bg-gold-pale flex items-center justify-center overflow-hidden">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.title}
                          className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-4xl sm:text-5xl">
                          {PRODUCT_EMOJIS[i % PRODUCT_EMOJIS.length]}
                        </span>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="mb-1 text-sm font-bold leading-snug font-display sm:text-base text-ink-dark">
                        {p.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-ink-muted flex items-center gap-1 font-body">
                        🌿 {p.city}
                      </p>
                    </div>
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