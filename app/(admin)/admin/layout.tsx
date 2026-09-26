import type { ReactNode } from "react";
import AdminNav from "@/app/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
