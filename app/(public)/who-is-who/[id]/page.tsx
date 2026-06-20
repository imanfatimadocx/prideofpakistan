import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProfileDetailPage({ params }: Props) {
  const { id } = await params
  const profileId = Number(id)

  if (Number.isNaN(profileId)) notFound()

  const profile = await prisma.hallOfFame.findUnique({
    where: { id: profileId },
  })

  if (!profile || profile.status !== 1) notFound()

  const image = profile.image ? `/uploads/${profile.image}` : null
  const description = (profile.description ?? profile.shortdesc ?? '')

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-12 bg-green sm:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <Link href="/who-is-who" className="inline-block mb-6 text-sm text-gold-light font-body hover:underline">
              ← Back to Who Is Who
            </Link>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={profile.title ?? 'Profile'}
                  className="flex-shrink-0 object-cover object-top w-32 h-32 border-4 rounded-full sm:w-44 sm:h-44 border-gold/30"
                />
              ) : (
                <div className="flex items-center justify-center flex-shrink-0 w-32 h-32 text-5xl font-bold text-white rounded-full sm:w-44 sm:h-44 bg-white/10 font-display">
                  {(profile.title ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-center sm:text-left">
                {profile.Profession && (
                  <span className="inline-block bg-gold text-white text-[10px] font-bold tracking-[.12em] uppercase px-3.5 py-1.5 rounded mb-3 font-body">
                    {profile.Profession}
                  </span>
                )}
                <h1 className="mb-2 text-3xl font-black leading-tight text-white font-display sm:text-5xl">
                  {profile.title}
                </h1>
                {(profile.City || profile.Country) && (
                  <p className="mb-3 text-sm text-gold-light font-body">
                    📍 {[profile.City, profile.Country].filter(Boolean).join(', ')}
                  </p>
                )}
                {profile.shortdesc && (
                  <p className="max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base font-body">
                    {profile.shortdesc.replace(/<[^>]*>/g, '')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-12 bg-cream sm:py-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-12">
            {description && (
              <div
                className="leading-relaxed prose prose-neutral max-w-none font-body text-ink-mid"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {/* Education */}
            {(profile.edu_degree || profile.edu_institute) && (
              <div className="p-6 mt-10 bg-white border border-border rounded-xl">
                <h3 className="mb-3 text-lg font-bold font-display text-green">Education</h3>
                <p className="text-sm text-ink-mid font-body">
                  {profile.edu_degree} {profile.edu_institute && `— ${profile.edu_institute}`} {profile.edu_year && `(${profile.edu_year})`}
                </p>
                {profile.edu_desc && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted font-body">
                    {profile.edu_desc.replace(/<[^>]*>/g, '')}
                  </p>
                )}
              </div>
            )}

            {/* Social links */}
            {(profile.facebook || profile.linkedin || profile.twitter) && (
              <div className="flex flex-wrap gap-4 mt-8">
                {profile.facebook && (
                  <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold font-body hover:underline">
                    Facebook ↗
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold font-body hover:underline">
                    LinkedIn ↗
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gold font-body hover:underline">
                    Twitter ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}