import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import Link from 'next/link'

export const revalidate = 3600

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === '') return null
  if (img.startsWith('http')) return img
  if (img.startsWith('/')) return img
  if (img.startsWith('uploads/')) return `/${img}`
  return `/uploads/${img}`
}

interface Props { params: Promise<{ id: string }> }

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params
  const bizId = Number(id)
  if (Number.isNaN(bizId)) notFound()

  const [biz, categories] = await Promise.all([
    prisma.business.findUnique({
      where: { id: bizId },
      include: { category: true },
    }),
    prisma.businessCategory.findMany({
      where: { status: 1 },
      orderBy: { name: 'asc' },
    }),
  ])

  if (!biz || biz.status !== 1) redirect('/business')

  const image = resolveImage(biz.image || null)

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-12">

          {/* Back */}
          <Link
            href="/business"
            className="flex items-center gap-2 text-sm font-semibold no-underline text-gold font-body hover:underline mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Business Directory
          </Link>

          {/* ── Flex row: image left, content right — stacks on mobile ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left — image + categories sidebar */}
            <div className="w-full lg:w-[340px] flex-shrink-0 space-y-5">

              {/* Image */}
              <div className="w-full overflow-hidden rounded-xl" style={{ aspectRatio: '600/350' }}>
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={biz.company_name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green">
                    <span className="font-display text-6xl font-bold text-white">
                      {biz.company_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Categories sidebar */}
              <div className="bg-white border border-border rounded-xl overflow-hidden lg:sticky lg:top-6">
                <div className="bg-green/10 border-b border-border px-4 py-3">
                  <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">Categories</h2>
                </div>
                <nav className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/business?category=${cat.id}`}
                      className={`block px-4 py-2.5 text-sm font-body transition-colors no-underline border-b border-border/50 last:border-0 ${
                        biz.category_id === cat.id
                          ? 'bg-gold-pale text-gold font-semibold'
                          : 'text-ink-dark hover:bg-gold-pale hover:text-gold'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right — all content */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Business name header */}
              <div className="bg-green rounded-xl px-6 py-4">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {biz.company_name}
                </h1>
                {biz.category && (
                  <p className="text-gold text-sm font-body mt-1">{biz.category.name}</p>
                )}
              </div>

              {/* Introduction */}
              {(biz.description || biz.company_description || biz.shortdesc) && (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="bg-green/10 border-b border-border px-5 py-3">
                    <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">Introduction</h2>
                  </div>
                  <div className="px-5 py-4">
                    {(biz.description || biz.company_description) ? (
                      <div
                        className="text-sm leading-relaxed text-ink-mid font-body prose prose-neutral max-w-none prose-a:text-gold prose-headings:font-display prose-headings:text-green"
                        dangerouslySetInnerHTML={{ __html: biz.description || biz.company_description }}
                      />
                    ) : (
                      <p className="text-sm leading-relaxed text-ink-mid font-body">{biz.shortdesc}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              {(biz.category || biz.keywords || biz.no_of_emplys) && (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="bg-green/10 border-b border-border px-5 py-3">
                    <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">Basic Information</h2>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {biz.category && (
                      <div className="flex gap-3 text-sm font-body">
                        <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Category:</span>
                        <span className="text-ink-mid">{biz.category.name}</span>
                      </div>
                    )}
                    {biz.keywords && (
                      <div className="flex gap-3 text-sm font-body">
                        <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Products / Services:</span>
                        <span className="text-ink-mid">{biz.keywords}</span>
                      </div>
                    )}
                    {biz.no_of_emplys && (
                      <div className="flex gap-3 text-sm font-body">
                        <span className="font-semibold text-ink-dark w-40 flex-shrink-0">No. of Employees:</span>
                        <span className="text-ink-mid">{biz.no_of_emplys}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="bg-green/10 border-b border-border px-5 py-3">
                  <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">Contact Information</h2>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {biz.company_name && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Company Title:</span>
                      <span className="text-ink-mid">{biz.company_name}</span>
                    </div>
                  )}
                  {(biz.name || biz.l_name) && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Contact Name:</span>
                      <span className="text-ink-mid">{[biz.name, biz.l_name].filter(Boolean).join(' ')}</span>
                    </div>
                  )}
                  {biz.email && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Email:</span>
                      <a href={`mailto:${biz.email}`} className="text-gold hover:underline no-underline">{biz.email}</a>
                    </div>
                  )}
                  {biz.city && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">City:</span>
                      <span className="text-ink-mid">{biz.city}</span>
                    </div>
                  )}
                  {biz.country && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Country:</span>
                      <span className="text-ink-mid">{biz.country}</span>
                    </div>
                  )}
                  {biz.phone && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Phone Number:</span>
                      <a href={`tel:${biz.phone}`} className="text-ink-mid hover:text-green no-underline">{biz.phone}</a>
                    </div>
                  )}
                  {biz.address && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Address:</span>
                      <span className="text-ink-mid">{biz.address}</span>
                    </div>
                  )}
                  {biz.site_url && (
                    <div className="flex gap-3 text-sm font-body">
                      <span className="font-semibold text-ink-dark w-40 flex-shrink-0">Website URL:</span>
                      <a
                        href={biz.site_url.startsWith('http') ? biz.site_url : `https://${biz.site_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:underline no-underline break-all"
                      >
                        {biz.site_url.replace(/https?:\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Now */}
                {biz.email && (
                  <div className="px-5 pb-5">
                    <a
                      href={`mailto:${biz.email}`}
                      className="inline-flex items-center gap-2 bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      Contact Now
                    </a>
                  </div>
                )}
              </div>

              {/* Google Maps */}
              {(biz.address || biz.city) && (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="bg-green/10 border-b border-border px-5 py-3">
                    <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">Location</h2>
                  </div>
                  <div className="w-full h-[280px]">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent([biz.address, biz.city, biz.country].filter(Boolean).join(', '))}&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Business location"
                    />
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://prideofpakistan.com/business/${bizId}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors no-underline font-body"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Share
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out ${biz.company_name} on Pride of Pakistan: https://prideofpakistan.com/business/${bizId}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded hover:bg-green-100 transition-colors no-underline font-body"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}