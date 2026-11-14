import type { ReactNode } from "react";
import { pageMeta } from "@/app/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "My Dashboard",
    description: "Your Pride of Pakistan dashboard.",
    path: "/dashboard",
  }),
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
