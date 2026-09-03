import AdminNav from "@/app/components/admin/AdminNav";
import { prisma } from "@/app/lib/prisma";
import ProductCategoriesClient from "./ProductCategoriesClient";

export const revalidate = 0;

export default async function ProductCategoriesPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[600px]">
          <h1 className="font-display text-2xl font-bold text-green mb-1">
            Product Categories
          </h1>
          <p className="text-sm text-ink-muted font-body mb-8">
            Manage Pakistani Products categories.
          </p>
          <ProductCategoriesClient
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
