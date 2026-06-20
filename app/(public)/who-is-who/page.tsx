import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export const revalidate = 60

interface Profile {
  id: number
  title: string
  Profession: string | null
  City: string | null
  Country: string | null
  image: string | null
  shortdesc: string | null
  categoryname?: string
}

async function getProfiles(): Promise<Profile[]> {
  const rows = await prisma.hallOfFame.findMany({
    where: { status: 1 },
    orderBy: { id: 'desc' },
    take: 60,
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title ?? 'Unknown',
    Profession: r.Profession,
    City: r.City,
    Country: r.Country,
    image: r.image ? `/uploads/${r.image}` : null,
    shortdesc: r.shortdesc,
  }))
}

export default async function WhoIsWhoPage() {
  let profiles: Profile[] = []
  try {
    profiles = await getProfiles()
  } catch {
    profiles = []
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Hall of Fame"
          title="Who Is Who"
          subtitle="Meet the Pakistanis who have made an extraordinary mark — in science, arts, sports, business, and beyond."
        />

        <section className="py-12 bg-cream sm:py-16 lg:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            {profiles.length === 0 ? (
              <p className="py-12 text-center text-ink-muted font-body">
                No profiles available yet. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
                {profiles.map((p) => (
                  <Link
                    key={p.id}
                    href={`/who-is-who/${p.id}`}
                    className="flex flex-col items-center p-5 text-center no-underline transition-all bg-white border border-border rounded-xl hover:border-gold hover:-translate-y-1 hover:shadow-xl"
                  >
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.title}
                        className="object-cover object-top w-16 h-16 mb-4 rounded-full sm:w-20 sm:h-20"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold text-white rounded-full sm:w-20 sm:h-20 bg-green font-display sm:text-3xl">
                        {p.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="mb-1 text-sm font-bold leading-tight font-display sm:text-base text-ink-dark">
                      {p.title}
                    </h3>
                    {p.Profession && (
                      <p className="text-[11px] sm:text-xs text-ink-muted font-body mb-1 line-clamp-1">
                        {p.Profession}
                      </p>
                    )}
                    {(p.City || p.Country) && (
                      <p className="text-[10px] sm:text-[11px] text-ink-muted font-body mb-2">
                        📍 {[p.City, p.Country].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <span className="mt-2 text-[11px] sm:text-xs text-gold font-semibold font-body">
                      Read Profile →
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