import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { uploadRoot, MIME_BY_EXT } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

/** Serves uploaded images from UPLOAD_DIR at /media/... */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;
  const root = uploadRoot();
  const full = path.resolve(root, ...(parts ?? []).map((p) => decodeURIComponent(p)));

  // block ../ tricks — the file must be inside the upload folder
  if (!full.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });

  const ext = path.extname(full).slice(1).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(full);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
