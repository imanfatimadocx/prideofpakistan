import AdminNav from "@/app/components/admin/AdminNav";
import { prisma } from "@/app/lib/prisma";
import ProductEditClient from "../[id]/edit/ProductsEditClient";

export default async function NewProductPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  const empty = {
    id: 0,
    title: "",
    categoryid: 0,
    description: "",
    shortdesc: "",
    status: 0,
    feature: 0,
    image: null,
    City: "",
    email: "",
    phone: "",
    address: "",
    meta_title: "",
    meta_desc: "",
    meta_keyword: "",
  };

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <ProductEditClient
          product={empty}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          isNew
        />
      </main>
    </div>
  );
}
