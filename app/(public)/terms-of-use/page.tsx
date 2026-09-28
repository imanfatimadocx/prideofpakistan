import type { Metadata } from "next";
import LegalPage from "@/app/components/shared/LegalPage";
import { getLegalContent } from "@/app/lib/legalContent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { title } = await getLegalContent("terms");
  return { title: `${title} | Pride of Pakistan` };
}

export default function TermsOfUsePage() {
  return <LegalPage slug="terms" />;
}
