"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Leaves room for the sidebar, except on the login page (which has no sidebar). */
export default function AdminMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/admin/login");

  if (isLogin) return <main>{children}</main>;

  return <main className="pt-14 lg:pt-0 lg:pl-64">{children}</main>;
}
