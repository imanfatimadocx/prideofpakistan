import type { ReactNode } from "react";
import { pageMeta } from "@/app/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Create Account",
    description: "Join Pride of Pakistan.",
    path: "/register",
  }),
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
