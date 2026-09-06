import { prisma } from "@/app/lib/prisma";
import AdminNav from "@/app/components/admin/AdminNav";
import ContactClient from "./ContactClient";

export const revalidate = 0;

export default async function AdminContactPage() {
  const queries = await prisma.contactQuery.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-[900px]">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-green mb-1">
              Contact Queries
            </h1>
            <p className="text-sm text-ink-muted font-body">
              {queries.filter((q) => !q.read).length} unread · {queries.length}{" "}
              total
            </p>
          </div>
          <ContactClient
            queries={queries.map((q) => ({
              id: q.id,
              name: q.name,
              email: q.email,
              subject: q.subject,
              message: q.message,
              read: q.read,
              createdAt: q.createdAt.toISOString(),
            }))}
          />
        </div>
      </main>
    </div>
  );
}
