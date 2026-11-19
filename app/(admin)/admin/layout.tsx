import type { ReactNode } from "react";
import AdminNav from "@/app/components/admin/AdminNav";
import AdminMain from "@/app/components/admin/AdminMain";
export const dynamic = "force-dynamic";

// Admin pages: own title, never listed by search engines
export const metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <AdminNav />
      <AdminMain>{children}</AdminMain>
    </div>
  );
}
