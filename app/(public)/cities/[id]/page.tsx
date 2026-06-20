import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const revalidate = 60

const CITY_IMAGES: Record<string, string> = {
  Islamabad: '/cities/islamabad.jpg',
  Lahore: '/cities/lahore.jpg',
  Karachi: '/cities/karachi.jpg',
  Peshawar: '/cities/peshawar.jpg',
  Quetta: '/cities/quetta.jpg',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function CityDetailPage({ params }: Props) {
  const { id } = await params
  const cityId = Number(id)
  if (Number.isNaN(cityId)) notFound()

  const city = await prisma.city.findUnique({ where: { id: cityId } })
  if (!city) notFound()

  const [profiles, businesses, products] = await Promise.all([
    prisma.hallOfFame.findMany({ where: { status: 1, City: city.name }, take: 6 }),
    prisma.business.findMany({ where: { status: 1, city: city.name }, take: 6 }),
    prisma.pakProduct.findMany({ where: { status: 1, City: city.name }, take: 6 }),
  ])

  const imageUrl = CITY_IMAGES[city.name] ?? '/cities/default.jpg'

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[260px] sm:h-[340px] overflow-hidden bg-green">
          <div
            className="absolute inset-0 bg-cover bg-center brightness-[.5]"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green/90 to-green/20" />
          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 h-full flex flex-col justify-end pb-8">
            <Link href="/cities" className="inline-block mb-3 text-sm text-gold-light font-body hover:underline">
              ← Back to Cities
            </Link>
            <h1 className="text-3xl font-black leading-tight text-white font-display sm:text-5xl">
              {city.name}
            </h1>
          </div>
        </section>

        {/* Profiles from this city */}
        {profiles.length > 0 && (
          <section className="py-12 bg-cream sm:py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
              <h2 className="mb-6 text-2xl font-bold font-display sm:text-3xl text-green">
                Notable People from {city.name}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {profiles.map((p) => (
                  <Link
                    key={p.id}
                    href={`/who-is-who/${p.id}`}
                    className="p-4 text-center no-underline transition-all bg-white border border-border rounded-xl hover:border-gold hover:-translate-y-1"
                  >
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/uploads/${p.image}`} alt={p.title ?? ''} className="object-cover object-top mx-auto mb-2 rounded-full w-14 h-14" />
                    ) : (
                      <div className="flex items-center justify-center mx-auto mb-2 font-bold text-white rounded-full w-14 h-14 bg-green font-display">
                        {(p.title ?? '?').charAt(0)}
                      </div>
                    )}
                    <p className="text-sm font-bold font-display text-ink-dark">{p.title}</p>
                    {p.Profession && <p className="mt-1 text-xs text-ink-muted font-body">{p.Profession}</p>}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Businesses */}
        {businesses.length > 0 && (
          <section className="py-12 bg-green sm:py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
              <h2 className="mb-6 text-2xl font-bold text-white font-display sm:text-3xl">
                Businesses in {city.name}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {businesses.map((b) => (
                  <Link
                    key={b.id}
                    href={`/business/${b.id}`}
                    className="bg-white/[.06] border border-white/10 rounded-xl p-5 no-underline hover:border-gold hover:-translate-y-1 transition-all"
                  >
                    <h3 className="mb-1 text-lg font-bold text-white font-display">{b.company_name}</h3>
                    <p className="text-sm text-white/55 font-body line-clamp-2">{b.shortdesc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products */}
        {products.length > 0 && (
          <section className="py-12 bg-white sm:py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
              <h2 className="mb-6 text-2xl font-bold font-display sm:text-3xl text-green">
                Products from {city.name}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="p-4 no-underline transition-all border rounded-lg border-border hover:border-gold hover:-translate-y-1"
                  >
                    <h3 className="text-sm font-bold font-display text-ink-dark">{p.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {profiles.length === 0 && businesses.length === 0 && products.length === 0 && (
          <section className="py-16 bg-cream">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
              <p className="text-ink-muted font-body">
                No content has been added for {city.name} yet.
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}