import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Where uploaded images are kept.
 * On Hostinger set UPLOAD_DIR to a folder OUTSIDE the app's build folder,
 * e.g. /home/u123456789/domains/prideofpakistan.com/uploads
 * (the build folders are wiped on every deploy).
 * Locally it defaults to ./storage in the project.
 */
export function uploadRoot(): string {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "storage"));
}

const TYPES: { ext: string; mime: string; test: (b: Buffer) => boolean }[] = [
  { ext: "jpg", mime: "image/jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "png", mime: "image/png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: "gif", mime: "image/gif", test: (b) => b.subarray(0, 4).toString("ascii") === "GIF8" },
  { ext: "webp", mime: "image/webp", test: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
  { ext: "avif", mime: "image/avif", test: (b) => b.subarray(4, 12).toString("ascii").startsWith("ftypavi") },
];

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
  webp: "image/webp", avif: "image/avif",
};

/** Checks the real file contents (not the browser's claim) — only real images pass. */
export function detectImage(buf: Buffer) {
  return TYPES.find((t) => buf.length > 12 && t.test(buf)) ?? null;
}

/**
 * Saves an image buffer and returns its public URL, e.g. /media/businesses/2026/10/ab12cd34.jpg
 * Throws if the file is not a supported image.
 */
export async function saveImage(buf: Buffer, folder = "general"): Promise<string> {
  const kind = detectImage(buf);
  if (!kind) throw new Error("Unsupported image type");

  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "general";
  const now = new Date();
  const rel = path.posix.join(
    safeFolder,
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
    `${crypto.randomBytes(12).toString("hex")}.${kind.ext}`,
  );

  const full = path.join(uploadRoot(), ...rel.split("/"));
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buf);
  return `/media/${rel}`;
}
