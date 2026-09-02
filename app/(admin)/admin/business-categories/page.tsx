import AdminNav from "@/app/components/admin/AdminNav";
import { prisma } from "@/app/lib/prisma";
import BizCategoriesClient from "./BizCategoriesClient";

export const revalidate = 0;

export default async function BizCategoriesPage() {
  const categories = await prisma.businessCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <div className="max-w-[600px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">
            Business Categories
          </h1>
          <p className="mb-8 text-sm text-ink-muted font-body">
            Manage business directory categories.
          </p>
          <BizCategoriesClient
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              status: c.status,
            }))}
          />
        </div>
      </main>
    </div>
  );
}
