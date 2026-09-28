import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { parseVideoUrl } from "@/app/lib/video";

// PATCH { video_url: string }  - empty string removes the video
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const bizId = Number(id);
  if (!Number.isInteger(bizId) || bizId <= 0)
    return NextResponse.json({ error: "Invalid business." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const raw = typeof body.video_url === "string" ? body.video_url.trim() : "";

  let stored = "";
  if (raw) {
    const parsed = parseVideoUrl(raw);
    if (!parsed)
      return NextResponse.json(
        { error: "Please paste a YouTube or Vimeo link." },
        { status: 400 },
      );
    stored = parsed.watchUrl;
  }

  try {
    await prisma.business.update({
      where: { id: bizId },
      data: { video_url: stored },
    });
    revalidatePath(`/business/${bizId}`);
    return NextResponse.json({ success: true, video_url: stored });
  } catch (err) {
    console.error("Business video update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
