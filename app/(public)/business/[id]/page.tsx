import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import CommentSection from "@/app/components/shared/CommentSection";
import Link from "next/link";

export const revalidate = 3600;

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params;
  const bizId = Number(id);
  if (Number.isNaN(bizId)) notFound();

  const biz = await prisma.business.findUnique({
    where: { id: bizId },
    include: { category: true },
  });

  if (!biz || biz.status !== 1) redirect("/business");

  const image = resolveImage(biz.image || null);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
          {/* Back */}
          <Link
            href="/business"
            className="flex items-center gap-2 mb-8 text-sm font-semibold no-underline text-gold font-body hover:underline"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Businesses
          </Link>

          {/* Hero flex row */}
          <div className="flex flex-col items-start gap-8 mb-10 sm:flex-row">
            {/* Image */}
            <div
              className="w-full sm:w-[320px] flex-shrink-0 overflow-hidden"
              style={{ aspectRatio: "600/350" }}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={biz.company_name}
                  className="object-cover object-top w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-green">
                  <span className="text-6xl font-bold text-white font-display">
                    {biz.company_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {biz.category && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold font-body bg-gold-pale px-2.5 py-1 rounded-full mb-3">
                  {biz.category.name}
                </span>
              )}
              <h1 className="mb-2 text-2xl font-bold leading-tight font-display sm:text-3xl text-green">
                {biz.company_name}
              </h1>
              {biz.shortdesc && (
                <p className="mb-4 text-sm leading-relaxed text-ink-mid font-body">
                  {biz.shortdesc}
                </p>
              )}

              {/* Contact details */}
              <div className="mb-5 space-y-2">
                {(biz.city || biz.country) && (
                  <div className="flex items-center gap-2.5 text-sm text-ink-muted font-body">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {[biz.city, biz.country].filter(Boolean).join(", ")}
                  </div>
                )}
                {biz.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-ink-muted font-body">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {biz.phone}
                  </div>
                )}
                {biz.email && (
                  <a
                    href={`mailto:${biz.email}`}
                    className="flex items-center gap-2.5 text-sm text-ink-mid hover:underline font-body no-underline"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    {biz.email}
                  </a>
                )}
                {biz.site_url && (
                  <a
                    href={
                      biz.site_url.startsWith("http")
                        ? biz.site_url
                        : `https://${biz.site_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-gold hover:underline font-body no-underline"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    {biz.site_url.replace(/https?:\/\/(www\.)?/, "")}
                  </a>
                )}
                {biz.address && (
                  <div className="flex items-start gap-2.5 text-sm text-ink-muted font-body">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <rect width="20" height="14" x="2" y="7" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    {biz.address}
                  </div>
                )}
              </div>

              {/* Share */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://prideofpakistan.com/business/${bizId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors no-underline font-body"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Share
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out ${biz.company_name} on Pride of Pakistan: https://prideofpakistan.com/business/${bizId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded hover:bg-green-100 transition-colors no-underline font-body"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Full description */}
          {(biz.description || biz.company_description) && (
            <div className="mb-8">
              <h2 className="mb-4 text-sm font-bold tracking-widest uppercase text-ink-muted font-display">
                About the Business
              </h2>
              <div
                className="text-sm leading-relaxed prose text-ink-mid font-body prose-neutral max-w-none prose-a:text-gold prose-headings:font-display prose-headings:text-green"
                dangerouslySetInnerHTML={{
                  __html: biz.description || biz.company_description,
                }}
              />
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 pb-16">
          <CommentSection entityType="business" entityId={bizId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
