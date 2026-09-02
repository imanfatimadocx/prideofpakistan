import AdminNav from "@/app/components/admin/AdminNav";
import { prisma } from "@/app/lib/prisma";
import BusinessEditClient from "../[id]/edit/BusinessEditClient";

export default async function NewBusinessPage() {
  const categories = await prisma.businessCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const empty = {
    id: 0,
    company_name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    address: "",
    site_url: "",
    shortdesc: "",
    description: "",
    status: 0,
    feature: 0,
    category_id: null,
    image: null,
  };

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <BusinessEditClient business={empty} categories={categories} isNew />
      </main>
    </div>
  );
}
