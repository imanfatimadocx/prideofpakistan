import { NextRequest, NextResponse } from "next/server";
import { getSlotPayload, isAdSlotKey, type SlotPayload } from "@/app/lib/ads";

export const dynamic = "force-dynamic";

// GET /api/ads/slot?slots=footer_showcase,footer_banner
// Used by ad spaces that load in the browser (the footer).
export async function GET(req: NextRequest) {
  const keys = (req.nextUrl.searchParams.get("slots") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(isAdSlotKey)
    .slice(0, 10);

  const out: Record<string, SlotPayload> = {};
  for (const k of keys) out[k] = await getSlotPayload(k);

  return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
}
