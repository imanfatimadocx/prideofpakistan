import { NextRequest, NextResponse } from "next/server";
import { isBot, recordAdEvent } from "@/app/lib/ads";

// POST { ids: number[] } - counts a view for each ad that appeared on screen.
// Sent with navigator.sendBeacon, so the body may arrive as plain text.
export async function POST(req: NextRequest) {
  if (isBot(req.headers.get("user-agent"))) return new NextResponse(null, { status: 204 });

  let ids: number[] = [];
  try {
    const body = JSON.parse(await req.text());
    ids = (Array.isArray(body?.ids) ? body.ids : [])
      .map(Number)
      .filter((n: number) => Number.isInteger(n) && n > 0)
      .slice(0, 10);
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  await Promise.all([...new Set(ids)].map((id) => recordAdEvent(id, "views")));
  return new NextResponse(null, { status: 204 });
}
