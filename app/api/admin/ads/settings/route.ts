import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { saveAdSettings } from "@/app/lib/ads";
import { saveAdvertisePage } from "@/app/lib/advertisePage";

// PUT { settings?, page? } - ad space settings and/or the Advertise with Us page text
export async function PUT(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  try {
    const out: Record<string, unknown> = {};
    if (body.settings) out.settings = await saveAdSettings(body.settings);
    if (body.page) out.page = await saveAdvertisePage(body.page);
    return NextResponse.json({ success: true, ...out });
  } catch (err) {
    console.error("Save ad settings failed:", err);
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}
