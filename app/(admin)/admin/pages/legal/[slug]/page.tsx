import { notFound } from "next/navigation";
import {
  LEGAL_DEFAULTS,
  LEGAL_PAGES,
  getLegalContent,
  isLegalSlug,
} from "@/app/lib/legalContent";
import LegalEditorClient from "./LegalEditorClient";

export const dynamic = "force-dynamic";

export default async function LegalEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const content = await getLegalContent(slug);

  return (
    <div className="p-4 lg:p-8">
      <LegalEditorClient
        slug={slug}
        label={LEGAL_PAGES[slug].label}
        publicPath={LEGAL_PAGES[slug].path}
        initial={content}
        defaults={LEGAL_DEFAULTS[slug]}
      />
    </div>
  );
}
