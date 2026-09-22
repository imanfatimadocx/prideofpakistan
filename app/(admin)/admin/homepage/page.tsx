import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import HomepageEditorClient from "./HomepageEditorClient";

export const revalidate = 3600;

export default async function AdminHomepagePage() {
  const hero = await prisma.homepageContent.findUnique({
    where: { section: "hero" },
  });

  const serialized = hero
    ? [
        {
          section: "hero",
          label: "Homepage Hero",
          content: hero.content as Record<string, string>,
        },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <div className="max-w-[860px]">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold font-display text-green">
              Homepage Hero
            </h1>
            <p className="text-sm text-ink-muted font-body">
              Edit the hero section shown at the top of the homepage. To edit
              other pages go to{" "}
              <a href="/admin/pages" className="text-gold hover:underline">
                Pages
              </a>
              .
            </p>
          </div>
          <HomepageEditorClient sections={serialized} />
        </div>
      </main>
    </div>
  );
}
