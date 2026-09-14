import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const PATHS = [
  "/",
  "/who-is-who",
  "/products",
  "/business",
  "/news",
  "/your-stories",
  "/contact",
  "/about",
  "/mission",
  "/pride-tv",
];

function doRevalidate() {
  for (const path of PATHS) revalidatePath(path);
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  doRevalidate();
  return NextResponse.json({ revalidated: true, paths: PATHS });
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  doRevalidate();
  return NextResponse.json({ revalidated: true, paths: PATHS });
}
