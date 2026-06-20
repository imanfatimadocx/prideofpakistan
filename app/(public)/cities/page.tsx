import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

interface City {
  id: number
  name: string
  imageUrl: string
}

const CITY_IMAGES: Record<string, string> = {
  Islamabad: '/cities/islamabad.jpg',
  Lahore: '/cities/lahore.jpg',
  Karachi: '/cities/karachi.jpg',
  Peshawar: '/cities/peshawar.jpg',
  Quetta: '/cities/quetta.jpg',
}

const PALETTES = ['#2d5a3d', '#3d5c3a', '#2a4a5e', '#5e3a2a', '#3a3d5e', '#5e4a2a']

async function getCities(): Promise<City[]> {
  const rows = await prisma.city.findMany({ orderBy: { name: 'asc' } })

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    imageUrl: CITY_IMAGES[r.name] ?? '/cities/default.jpg',
  }))
}

export default async function CitiesPage() {
  let cities: City[] = []
  try {
    cities = await getCities()
  } catch {
    cities = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Explore Pakistan"
          title="Cities, Towns & Villages"
          subtitle="From bustling metropolises to historic mountain towns — discover the places that shape Pakistan's identity."
        />

        <section className="py-12 bg-cream sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {cities.length === 0 ? (
              <p className="py-12 text-center text-ink-muted font-body">
                No cities available yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
                {cities.map((city, i) => (
                  <Link
                    key={city.id}
                    href={`/cities/${city.id}`}
                    className="relative block overflow-hidden no-underline rounded-lg group h-44 sm:h-52"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06]"
                      style={{
                        backgroundImage: `url('${city.imageUrl}')`,
                        backgroundColor: PALETTES[i % PALETTES.length],
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green/[.88] via-green/[.15] to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <div className="text-base font-bold leading-tight text-white font-display sm:text-lg">
                        {city.name}
                      </div>
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