import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { plainText, sanitizeRichHtml } from "@/app/lib/sanitize";
import { LEGAL_PAGES, isLegalSlug, type LegalContent } from "@/app/lib/legalContent";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { slug } = await params;
  if (!isLegalSlug(slug))
    return NextResponse.json({ error: "Unknown page." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const title = plainText(body.title, 150);
  if (!title) return NextResponse.json({ error: "Page title is required." }, { status: 400 });

  const sections = (Array.isArray(body.sections) ? body.sections : [])
    .slice(0, 100)
    .map((s: Record<string, unknown>, i: number) => ({
      id: plainText(s.id, 40) || `s${Date.now()}${i}`,
      heading: plainText(s.heading, 255),
      html: sanitizeRichHtml(typeof s.html === "string" ? s.html : ""),
      hidden: Boolean(s.hidden),
    }))
    .filter((s: { heading: string; html: string }) => s.heading || s.html);

  const content: LegalContent = {
    title,
    intro: sanitizeRichHtml(typeof body.intro === "string" ? body.intro : ""),
    sections,
    updatedAt: new Date().toISOString(),
  };

  const key = LEGAL_PAGES[slug].key;
  await prisma.pageContent.upsert({
    where: { page: key },
    update: { content: content as object },
    create: { page: key, content: content as object },
  });
  revalidatePath(LEGAL_PAGES[slug].path);

  return NextResponse.json({ success: true, content });
}
