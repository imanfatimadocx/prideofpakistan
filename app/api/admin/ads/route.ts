import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isAdmin } from "@/app/lib/adminAuth";
import { adData } from "@/app/lib/ads";

// POST - create an ad
export async function POST(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const parsed = adData(await req.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });
  try {
    const ad = await prisma.advertisement.create({ data: parsed.data });
    return NextResponse.json({ id: ad.id });
  } catch (err) {
    console.error("Create ad failed:", err);
    return NextResponse.json(
      { error: "Could not save. If this is the first ad, make sure the database update (advertisements table) has been run." },
      { status: 500 },
    );
  }
}
