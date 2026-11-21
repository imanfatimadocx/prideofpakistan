import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isBot, recordAdEvent } from "@/app/lib/ads";

export const dynamic = "force-dynamic";

// GET /api/ads/click/12 - counts the click, then sends the visitor to the advertiser.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const home = new URL("/", req.url);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.redirect(home, 302);

  const ad = await prisma.advertisement
    .findUnique({ where: { id }, select: { linkUrl: true } })
    .catch(() => null);
  if (!ad?.linkUrl) return NextResponse.redirect(home, 302);

  if (!isBot(req.headers.get("user-agent"))) await recordAdEvent(id, "clicks");

  // Links were checked when the ad was saved (http/https, tel:, mailto:).
  const res = NextResponse.redirect(ad.linkUrl, 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
