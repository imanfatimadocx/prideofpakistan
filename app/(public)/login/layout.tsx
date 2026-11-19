import type { ReactNode } from "react";
import { pageMeta } from "@/app/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Sign In",
    description: "Sign in to your Pride of Pakistan account.",
    path: "/login",
  }),
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
