import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import CommentSection from "@/app/components/shared/CommentSection";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

function resolveImage(img: string | null): string | null {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

const FB =
  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const LI =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const TH =
  "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 9.64c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.217.093.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.832-7.284 2.858zM10.049 13.049c-.096 0-.192.003-.29.009-1.955.112-2.719.923-2.674 1.713.033.601.396 1.023.985 1.401.604.392 1.408.557 2.26.507 1.026-.056 1.795-.404 2.287-1.038.487-.627.709-1.553.657-2.755a11.587 11.587 0 0 0-3.225.163z";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-bold tracking-widest uppercase text-gold font-body">
      {children}
    </h2>
  );
}

export default async function ProfileDetailPage({ params }: Props) {
  const { id } = await params;
  const profileId = Number(id);
  if (Number.isNaN(profileId)) notFound();

  const profile = await prisma.hallOfFame.findUnique({
    where: { id: profileId },
  });

  if (!profile || profile.status !== 1) notFound();

  const category = profile.categoryid
    ? await prisma.hallCategory.findUnique({
        where: { categoryid: profile.categoryid },
        select: { categoryname: true },
      })
    : null;

  const image = resolveImage(profile.image);
  const description = profile.description ?? "";
  const shareUrl = encodeURIComponent(
    `https://prideofpakistan.com/who-is-who/${profileId}`,
  );
  const location = [profile.City, profile.Country].filter(Boolean).join(", ");

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
          {/* Back link */}
          <Link
            href="/who-is-who"
            className="inline-flex items-center gap-2 mb-6 text-sm font-semibold no-underline text-gold font-body hover:underline"
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
            Back to Who Is Who
          </Link>

          <div className="grid items-start grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
            {/* ── Main content (left) ── */}
            <article className="order-last min-w-0 lg:order-first">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl font-display text-green">
                {profile.title}
              </h1>
              {profile.Profession && (
                <p className="mt-2 text-base font-semibold text-gold font-body">
                  {profile.Profession}
                </p>
              )}
              {(location || category?.categoryname) && (
                <p className="mt-1 text-sm text-ink-muted font-body">
                  {[category?.categoryname, location]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              {profile.shortdesc && (
                <section className="pt-6 mt-6 border-t border-border">
                  <SectionTitle>Introduction</SectionTitle>
                  <div
                    className="text-base leading-relaxed text-ink-dark font-body"
                    dangerouslySetInnerHTML={{ __html: profile.shortdesc }}
                  />
                </section>
              )}

              {description && description !== profile.shortdesc && (
                <section className="pt-6 mt-8 border-t border-border">
                  <SectionTitle>Professional Achievements</SectionTitle>
                  <div
                    className="text-base leading-relaxed prose prose-neutral max-w-none text-ink-dark font-body prose-a:text-gold prose-headings:font-display prose-headings:text-green prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </section>
              )}

              {profile.edu_desc && (
                <section className="pt-6 mt-8 border-t border-border">
                  <SectionTitle>Education</SectionTitle>
                  <div
                    className="text-base leading-relaxed text-ink-dark font-body"
                    dangerouslySetInnerHTML={{ __html: profile.edu_desc }}
                  />
                </section>
              )}
            </article>

            {/* ── Sidebar (right) — image first on mobile ── */}
            <aside className="order-first space-y-6 lg:order-last lg:sticky lg:top-24">
              {/* Photo — same 600×350 ratio as the homepage / Who Is Who cards */}
              <div
                className="w-full overflow-hidden rounded-lg bg-cream"
                style={{ aspectRatio: "600/350" }}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={profile.title ?? "Profile"}
                    className="object-top w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-green">
                    <span className="text-6xl font-bold text-white font-display">
                      {(profile.title ?? "?").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact & links */}
              {(profile.Email ||
                profile.facebook ||
                profile.linkedin ||
                profile.threads ||
                location) && (
                <div>
                  <SectionTitle>Contact</SectionTitle>
                  <div className="space-y-2.5">
                    {profile.Email && (
                      <a
                        href={`mailto:${profile.Email}`}
                        className="flex items-center gap-2.5 text-sm text-ink-dark no-underline hover:text-green font-body break-all"
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
                          className="flex-shrink-0 text-gold"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {profile.Email}
                      </a>
                    )}
                    {location && (
                      <div className="flex items-center gap-2.5 text-sm text-ink-dark font-body">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="flex-shrink-0 text-gold"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {location}
                      </div>
                    )}
                    {profile.facebook && (
                      <a
                        href={
                          profile.facebook.startsWith("http")
                            ? profile.facebook
                            : `https://${profile.facebook}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-ink-dark no-underline hover:text-green font-body"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="flex-shrink-0 text-[#1877F2]"
                        >
                          <path d={FB} />
                        </svg>
                        Facebook
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={
                          profile.linkedin.startsWith("http")
                            ? profile.linkedin
                            : `https://${profile.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-ink-dark no-underline hover:text-green font-body"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="flex-shrink-0 text-[#0A66C2]"
                        >
                          <path d={LI} />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {profile.threads && (
                      <a
                        href={
                          profile.threads.startsWith("http")
                            ? profile.threads
                            : `https://www.threads.net/@${profile.threads}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-ink-dark no-underline hover:text-green font-body"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="flex-shrink-0"
                        >
                          <path d={TH} />
                        </svg>
                        Threads
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Education summary */}
              {(profile.edu_degree || profile.edu_institute) && (
                <div className="pt-6 border-t border-border">
                  <SectionTitle>Education</SectionTitle>
                  {profile.edu_degree && (
                    <p className="text-sm font-semibold text-ink-dark font-body">
                      {profile.edu_degree}
                    </p>
                  )}
                  {profile.edu_institute && (
                    <p className="text-sm text-ink-muted font-body mt-0.5">
                      {profile.edu_institute}
                    </p>
                  )}
                  {profile.edu_year && (
                    <p className="text-xs text-ink-muted font-body mt-0.5">
                      {profile.edu_year}
                    </p>
                  )}
                </div>
              )}

              {/* Share */}
              <div className="pt-6 border-t border-border">
                <SectionTitle>Share this profile</SectionTitle>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold no-underline text-[#1877F2] hover:underline font-body"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={FB} />
                    </svg>
                    Facebook
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold no-underline text-[#0A66C2] hover:underline font-body"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={LI} />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href={`https://wa.me/?text=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold no-underline text-[#25D366] hover:underline font-body"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Comments */}
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 pb-16">
          <CommentSection entityType="profile" entityId={profileId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
