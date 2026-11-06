import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { uploadRoot, MIME_BY_EXT } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "public, max-age=31536000, immutable",
  "X-Content-Type-Options": "nosniff",
};

/** Serves images saved in the database at /media/... */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;
  const rel = (parts ?? []).map((p) => decodeURIComponent(p)).join("/");
  if (!rel || rel.includes("..")) return new Response("Not found", { status: 404 });

  // 1) the database (normal case)
  const m = await prisma.media.findUnique({ where: { path: rel } });
  if (m) {
    return new Response(new Uint8Array(m.data), {
      headers: { ...HEADERS, "Content-Type": m.mime, "Content-Length": String(m.size) },
    });
  }

  // 2) fallback: an old file on disk (./storage locally, or UPLOAD_DIR if set)
  const ext = path.extname(rel).slice(1).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  const root = uploadRoot();
  const full = path.resolve(root, ...rel.split("/"));
  if (mime && full.startsWith(root + path.sep)) {
    try {
      const data = await fs.readFile(full);
      return new Response(new Uint8Array(data), { headers: { ...HEADERS, "Content-Type": mime } });
    } catch {}
  }
  return new Response("Not found", { status: 404 });
}
