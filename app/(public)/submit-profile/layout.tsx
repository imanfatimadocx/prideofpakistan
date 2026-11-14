import type { ReactNode } from "react";
import { pageMeta } from "@/app/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Submit Your Profile",
    description: "Submit a profile to be considered for Who Is Who.",
    path: "/submit-profile",
  }),
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
