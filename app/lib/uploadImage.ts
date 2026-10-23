/**
 * Shrinks a photo in the browser before upload (max 1600px, JPEG ~85%),
 * then uploads it to /api/upload and returns the image URL.
 * GIFs are uploaded as-is so animations keep working.
 */
const MAX_SIDE = 1600;

async function compress(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // transparent PNGs get a white background
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/jpeg", 0.85),
    );
    if (!blob || blob.size >= file.size) return file; // keep original if not smaller
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    return file; // browser can't decode it (e.g. HEIC) – let the server decide
  }
}

export async function uploadImage(
  file: File,
  folder = "general",
): Promise<string> {
  const small = await compress(file);
  const fd = new FormData();
  fd.append("file", small);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`);
  const url = json.url ?? json.path;
  if (!url) throw new Error("Upload failed: no image link returned");
  return url as string;
}
