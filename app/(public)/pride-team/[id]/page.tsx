import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { prisma } from "@/app/lib/prisma";
import { resolveImage } from "@/app/lib/images";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const getMember = cache(async (id: number) =>
  prisma.prideTeam.findFirst({
    where: { id, status: 1 },
    select: {
      id: true,
      fullname: true,
      designation: true,
      city: true,
      country: true,
      image: true,
      description: true,
      phone: true,
      email: true,
    },
  }),
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  const m = Number.isInteger(id) ? await getMember(id) : null;
  if (!m) return { title: "Pride Team | Pride of Pakistan" };
  return {
    title: `${m.fullname} | Pride Team | Pride of Pakistan`,
    description: m.description?.slice(0, 160) || m.designation || undefined,
  };
}

export default async function PrideTeamMemberPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const member = await getMember(id);
  if (!member) notFound();

  // A few other team members for the "More from the Pride Team" row
  const others = await prisma.prideTeam
    .findMany({
      where: { status: 1, id: { not: member.id } },
      select: { id: true, fullname: true, designation: true, image: true },
      orderBy: { fullname: "asc" },
      take: 50,
    })
    .then((rows) => rows.sort(() => Math.random() - 0.5).slice(0, 5))
    .catch(() => []);

  const image = resolveImage(member.image);
  const place = [member.city, member.country].filter(Boolean).join(", ");
  const url = `https://prideofpakistan.com/pride-team/${member.id}`;

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
            {/* ── Left sidebar ── */}
            <div className="space-y-4">
              <Link
                href="/pride-team"
                className="flex items-center gap-2 text-sm font-semibold no-underline text-gold font-body hover:underline"
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
                Back to Pride Team
              </Link>

              <div className="overflow-hidden bg-white border border-border rounded-xl">
                <div className="w-full overflow-hidden aspect-[90/85] bg-cream">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={member.fullname}
                      className="object-cover object-top w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-green">
                      <span className="text-6xl font-bold text-white font-display">
                        {member.fullname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-4 py-4 border-b border-border">
                  <h1 className="mb-1 text-xl font-bold tracking-wide uppercase text-ink-dark font-display">
                    {member.fullname}
                  </h1>
                  {member.designation && (
                    <p className="text-sm font-semibold text-gold font-body">
                      {member.designation}
                    </p>
                  )}
                </div>

                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2.5 text-sm text-ink-mid font-body">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 text-green"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    Pride Team Member
                  </div>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2.5 text-sm no-underline break-all text-ink-mid font-body hover:text-gold"
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
                        className="flex-shrink-0 text-green"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                      className="flex items-center gap-2.5 text-sm no-underline text-ink-mid font-body hover:text-gold"
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
                        className="flex-shrink-0 text-green"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {member.phone}
                    </a>
                  )}
                  {place && (
                    <div className="flex items-center gap-2.5 text-sm text-ink-mid font-body">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 text-green"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {place}
                    </div>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition-colors no-underline font-body"
                >
                  Share on Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Meet ${member.fullname} of the Pride of Pakistan team: ${url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded hover:bg-green-100 transition-colors no-underline font-body"
                >
                  Share on WhatsApp
                </a>
              </div>
            </div>

            {/* ── Right content ── */}
            <div className="space-y-5">
              <div className="p-6 bg-white border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 text-green"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  <h2 className="text-sm font-bold tracking-wide uppercase text-green font-display">
                    About {member.fullname.split(" ")[0]}
                  </h2>
                </div>
                {member.description ? (
                  <p className="text-sm leading-relaxed whitespace-pre-line text-ink-mid font-body">
                    {member.description}
                  </p>
                ) : (
                  <p className="text-sm text-ink-muted font-body">
                    {member.fullname} is part of the Pride of Pakistan team
                    {member.designation ? ` as ${member.designation}` : ""}
                    {place ? `, based in ${place}` : ""}.
                  </p>
                )}
              </div>

              {/* <div className="p-6 border bg-green/5 border-green/20 rounded-xl">
                <h2 className="mb-1 text-base font-bold font-display text-green">
                  Want to join the Pride Team?
                </h2>
                <p className="mb-4 text-sm text-left text-ink-mid font-body">
                  We&apos;re always looking for people who want to share the
                  best of Pakistan with the world.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
                >
                  Get in Touch
                </Link>
              </div> */}

              {others.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold font-display text-green">
                      More from the Pride Team
                    </h2>
                    <Link
                      href="/pride-team"
                      className="text-xs font-semibold no-underline text-gold font-body hover:underline"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {others.map((o) => {
                      const img = resolveImage(o.image);
                      return (
                        <Link
                          key={o.id}
                          href={`/pride-team/${o.id}`}
                          className="no-underline group"
                        >
                          <div
                            className="w-full overflow-hidden rounded-lg"
                            style={{ aspectRatio: "650/500" }}
                          >
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={img}
                                alt={o.fullname}
                                loading="lazy"
                                className="object-cover object-top w-full h-full transition-transform duration-300 rounded-lg group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-xl font-bold text-white rounded-lg bg-green font-display">
                                {o.fullname.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-[11px] font-bold leading-snug transition-colors text-ink-dark font-display group-hover:text-green line-clamp-2">
                            {o.fullname}
                          </p>
                          {o.designation && (
                            <p className="text-[10px] text-gold font-body line-clamp-1">
                              {o.designation}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
