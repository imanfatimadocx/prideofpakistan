import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import HomepageEditorClient from "./HomepageEditorClient";

export const revalidate = 0;

const SECTION_LABELS: Record<string, string> = {
  hero: "Homepage Hero",
  page_whoiswho: "Who Is Who Page",
  page_products: "Pakistani Products Page",
  page_businesses: "Pakistani Businesses Page",
  page_news: "Latest News Page",
  page_stories: "Your Stories Page",
  page_contact: "Contact Page",
  page_pridetv: "Pride TV Page",
};

const ORDER = [
  "hero",
  "page_whoiswho",
  "page_products",
  "page_businesses",
  "page_news",
  "page_stories",
  "page_contact",
  "page_pridetv",
];

export default async function AdminHomepagePage() {
  const allSections = await prisma.homepageContent.findMany({
    orderBy: { section: "asc" },
  });

  // Filter to only sections we want to show
  const filtered = allSections.filter((s) => ORDER.includes(s.section));

  const serialized = filtered.map((s) => ({
    section: s.section,
    label: SECTION_LABELS[s.section] ?? s.section,
    content: s.content as Record<string, string>,
  }));

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <div className="max-w-[860px]">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold font-display text-green">
              Page Content
            </h1>
            <p className="text-sm text-ink-muted font-body">
              Edit the eyebrow, heading and subtext for each page. Changes are
              live instantly.
            </p>
          </div>
          <HomepageEditorClient sections={serialized} />
        </div>
      </main>
    </div>
  );
}
