import type { Metadata } from "next";
import LegalPage from "@/app/components/shared/LegalPage";
import { getLegalContent } from "@/app/lib/legalContent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { title } = await getLegalContent("cookies");
  return { title: `${title}` };
}

export default function CookiePolicyPage() {
  return <LegalPage slug="cookies" />;
}
