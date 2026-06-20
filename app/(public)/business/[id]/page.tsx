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

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params
  const bizId = Number(id)
  if (Number.isNaN(bizId)) notFound()

  const biz = await prisma.business.findUnique({ where: { id: bizId } })
  if (!biz || biz.status !== 1) notFound()

  const image = biz.image ? `/uploads/${biz.image}` : null

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <section className="py-12 bg-green sm:py-16">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12">
            <Link href="/business" className="inline-block mb-6 text-sm text-gold-light font-body hover:underline">
              ← Back to Business Directory
            </Link>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-24 h-24 overflow-hidden text-4xl sm:w-28 sm:h-28 bg-white/10 rounded-xl">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={biz.company_name} className="object-cover w-full h-full" />
                ) : (
                  <span>🏢</span>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="mb-2 text-3xl font-bold leading-tight text-white font-display sm:text-4xl">
                  {biz.company_name}
                </h1>
                <p className="mb-1 text-sm text-gold-light font-body">
                  📍 {biz.city}, {biz.country}
                </p>
                {biz.site_url && (
                  <a
                    href={biz.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-white/60 font-body hover:text-white"
                  >
                    {biz.site_url}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-cream sm:py-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-12">
            {biz.shortdesc && (
              <p className="mb-6 text-base font-medium leading-relaxed text-ink-mid font-body">
                {biz.shortdesc}
              </p>
            )}

            {biz.company_description && (
              <div
                className="leading-relaxed prose prose-neutral max-w-none font-body text-ink-mid"
                dangerouslySetInnerHTML={{ __html: biz.company_description }}
              />
            )}

            <div className="grid grid-cols-1 gap-4 p-6 mt-10 text-sm bg-white border border-border rounded-xl sm:grid-cols-2 font-body">
              {biz.address && (
                <div>
                  <p className="mb-1 text-xs tracking-wide uppercase text-ink-muted">Address</p>
                  <p className="text-ink-dark">{biz.address}</p>
                </div>
              )}
              {biz.phone && (
                <div>
                  <p className="mb-1 text-xs tracking-wide uppercase text-ink-muted">Phone</p>
                  <p className="text-ink-dark">{biz.phone}</p>
                </div>
              )}
              {biz.email && (
                <div>
                  <p className="mb-1 text-xs tracking-wide uppercase text-ink-muted">Email</p>
                  <p className="text-ink-dark">{biz.email}</p>
                </div>
              )}
              {biz.no_of_emplys && (
                <div>
                  <p className="mb-1 text-xs tracking-wide uppercase text-ink-muted">Employees</p>
                  <p className="text-ink-dark">{biz.no_of_emplys}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
