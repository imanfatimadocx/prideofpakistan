import type { ReactNode } from "react";
import AdminNav from "@/app/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <AdminNav />
      <main className="pt-14 lg:pt-8 lg:pl-64">{children}</main>
    </div>
  );
}
