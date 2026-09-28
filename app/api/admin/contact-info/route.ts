import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { plainText } from "@/app/lib/sanitize";
import {
  CONTACT_INFO_KEY,
  type ContactInfo,
  type ContactItemType,
  type SocialPlatform,
} from "@/app/lib/contactInfo";

const ITEM_TYPES: ContactItemType[] = ["email", "phone", "url", "text"];
const PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "youtube", "linkedin", "tiktok", "whatsapp", "other"];

type Raw = Record<string, unknown>;
const arr = (v: unknown): Raw[] => (Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : []);
const id = (v: unknown, i: number) => plainText(v, 40) || `i${Date.now()}${i}`;

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const b = (await req.json().catch(() => ({}))) as Raw;

  const items = arr(b.items)
    .map((it, i) => ({
      id: id(it.id, i),
      label: plainText(it.label, 100),
      value: plainText(it.value, 255),
      type: ITEM_TYPES.includes(it.type as ContactItemType) ? (it.type as ContactItemType) : "text",
      hidden: Boolean(it.hidden),
    }))
    .filter((it) => it.value);

  const socials = arr(b.socials)
    .map((s, i) => {
      const raw = plainText(s.url, 500);
      const url = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
      return {
        id: id(s.id, i),
        platform: PLATFORMS.includes(s.platform as SocialPlatform) ? (s.platform as SocialPlatform) : "other",
        label: plainText(s.label, 60),
        url,
        hidden: Boolean(s.hidden),
      };
    })
    .filter((s) => s.url);

  const formEmail = plainText(b.formEmail, 200);
  if (formEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail))
    return NextResponse.json({ error: "The form email address doesn't look right." }, { status: 400 });

  const content: ContactInfo = {
    introHeading: plainText(b.introHeading, 200),
    introText: plainText(b.introText, 2000),
    infoTitle: plainText(b.infoTitle, 100),
    items,
    responseTitle: plainText(b.responseTitle, 100),
    responseText: plainText(b.responseText, 500),
    socialTitle: plainText(b.socialTitle, 100),
    socials,
    formHeading: plainText(b.formHeading, 100),
    formSubtext: plainText(b.formSubtext, 300),
    formEmail,
    successHeading: plainText(b.successHeading, 100),
    successText: plainText(b.successText, 300),
  };

  await prisma.pageContent.upsert({
    where: { page: CONTACT_INFO_KEY },
    update: { content: content as object },
    create: { page: CONTACT_INFO_KEY, content: content as object },
  });
  revalidatePath("/contact");

  return NextResponse.json({ success: true, content });
}
