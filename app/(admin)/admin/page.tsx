import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalProfiles,
    pendingProfiles,
    featuredProfiles,
    totalBusinesses,
    pendingBusinesses,
    totalProducts,
    totalStories,
    pendingStories,
    totalNews,
    totalVideos,
    totalContacts,
    totalComments,
  ] = await Promise.all([
    prisma.hallOfFame.count(),
    prisma.hallOfFame.count({ where: { status: 0 } }),
    prisma.hallOfFame.count({ where: { feature: 1 } }),
    prisma.business.count(),
    prisma.business.count({ where: { status: 0 } }),
    prisma.pakProduct.count(),
    prisma.userStory.count(),
    prisma.userStory.count({ where: { status: "pending" } }),
    prisma.latestNews.count(),
    prisma.video.count({ where: { status: "active" } }),
    prisma.contactQuery.count({ where: { read: false } }),
    prisma.comment.count(),
  ]);

  const SECTIONS = [
    {
      label: "Hall of Fame",
      color: "border-green",
      stats: [
        { label: "Total Profiles", value: totalProfiles },
        {
          label: "Pending Approval",
          value: pendingProfiles,
          alert: pendingProfiles > 0,
        },
        { label: "Featured", value: featuredProfiles },
      ],
      actions: [
        { label: "Manage Profiles", href: "/admin/profiles" },
        { label: "Add Profile", href: "/admin/profiles/new" },
        { label: "Categories", href: "/admin/categories" },
      ],
    },
    {
      label: "Pakistani Businesses",
      color: "border-gold",
      stats: [
        { label: "Total Businesses", value: totalBusinesses },
        {
          label: "Pending Approval",
          value: pendingBusinesses,
          alert: pendingBusinesses > 0,
        },
      ],
      actions: [
        { label: "Manage Businesses", href: "/admin/business" },
        { label: "Add Business", href: "/admin/business/new" },
        { label: "Categories", href: "/admin/business-categories" },
      ],
    },
    {
      label: "Pakistani Products",
      color: "border-amber-400",
      stats: [{ label: "Total Products", value: totalProducts }],
      actions: [
        { label: "Manage Products", href: "/admin/products" },
        { label: "Add Product", href: "/admin/products/new" },
        { label: "Categories", href: "/admin/product-categories" },
      ],
    },
    {
      label: "Discussion Forum & Stories",
      color: "border-blue-400",
      stats: [
        { label: "Total Stories", value: totalStories },
        {
          label: "Pending Review",
          value: pendingStories,
          alert: pendingStories > 0,
        },
        { label: "News Posts", value: totalNews },
      ],
      actions: [
        { label: "Discussion Forum", href: "/admin/news" },
        { label: "Write in Discussion Forum", href: "/admin/news/new" },
        { label: "Your Stories", href: "/admin/user-stories" },
      ],
    },
    {
      label: "Pride TV",
      color: "border-red-400",
      stats: [{ label: "Active Videos", value: totalVideos }],
      actions: [{ label: "Manage Videos", href: "/admin/media" }],
    },
    {
      label: "Other",
      color: "border-ink-muted",
      stats: [
        {
          label: "Contact Queries",
          value: totalContacts,
          alert: totalContacts > 0,
        },
        { label: "Comments", value: totalComments },
      ],
      actions: [
        { label: "Contact Queries", href: "/admin/contact" },
        { label: "Comments", href: "/admin/comments" },
        { label: "Event Banners", href: "/admin/banners" },
      ],
    },
  ];

  const totalPending =
    pendingProfiles + pendingBusinesses + pendingStories + totalContacts;

  return (
    <div className="flex min-h-screen bg-cream">
      <main className="flex-1 p-4 lg:ml-64lg:p-8">
        <div className="max-w-[1100px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-bold font-display text-green">
              Dashboard
            </h1>
            <p className="text-sm text-ink-muted font-body">
              Welcome back.{" "}
              {totalPending > 0 ? (
                <span className="font-semibold text-amber-600">
                  {totalPending} item{totalPending !== 1 ? "s" : ""} pending
                  review.
                </span>
              ) : (
                <span>Everything is up to date.</span>
              )}
            </p>
          </div>

          {/* Section cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SECTIONS.map((section) => (
              <div
                key={section.label}
                className={`bg-white border-l-4 ${section.color} border border-border rounded-xl overflow-hidden`}
              >
                {/* Section header */}
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-base font-bold font-display text-green">
                    {section.label}
                  </h2>
                </div>

                {/* Stats */}
                <div className="flex gap-6 px-5 py-4 border-b border-border">
                  {section.stats.map((stat) => (
                    <div key={stat.label}>
                      <p
                        className={`text-2xl font-black font-display ${stat.alert ? "text-amber-500" : "text-green"}`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-ink-muted font-body mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-2 px-5 py-3">
                  {section.actions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="text-xs font-semibold text-gold font-body hover:underline no-underline border border-gold/20 bg-gold-pale px-3 py-1.5 rounded-md hover:bg-gold/10 transition-colors"
                    >
                      {action.label} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pending alert banner */}
          {totalPending > 0 && (
            <div className="px-5 py-4 mt-6 border bg-amber-50 border-amber-200 rounded-xl">
              <p className="mb-3 text-sm font-semibold text-amber-800 font-body">
                Items requiring attention:
              </p>
              <div className="flex flex-wrap gap-3">
                {pendingProfiles > 0 && (
                  <Link
                    href="/admin/profiles?status=0"
                    className="text-xs font-semibold text-amber-700 border border-amber-300 bg-amber-100 px-3 py-1.5 rounded-md hover:bg-amber-200 transition-colors no-underline font-body"
                  >
                    {pendingProfiles} profile{pendingProfiles !== 1 ? "s" : ""}{" "}
                    pending →
                  </Link>
                )}
                {pendingBusinesses > 0 && (
                  <Link
                    href="/admin/business"
                    className="text-xs font-semibold text-amber-700 border border-amber-300 bg-amber-100 px-3 py-1.5 rounded-md hover:bg-amber-200 transition-colors no-underline font-body"
                  >
                    {pendingBusinesses} business
                    {pendingBusinesses !== 1 ? "es" : ""} pending →
                  </Link>
                )}
                {pendingStories > 0 && (
                  <Link
                    href="/admin/stories"
                    className="text-xs font-semibold text-amber-700 border border-amber-300 bg-amber-100 px-3 py-1.5 rounded-md hover:bg-amber-200 transition-colors no-underline font-body"
                  >
                    {pendingStories} stor{pendingStories !== 1 ? "ies" : "y"}{" "}
                    pending →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
