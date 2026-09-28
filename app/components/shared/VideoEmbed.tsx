import { parseVideoUrl } from "@/app/lib/video";

/** Responsive 16:9 YouTube/Vimeo player. Renders nothing for an invalid link. */
export default function VideoEmbed({
  url,
  title,
  className = "",
}: {
  url: string | null | undefined;
  title: string;
  className?: string;
}) {
  const video = parseVideoUrl(url);
  if (!video) return null;
  return (
    <div
      className={`relative w-full overflow-hidden bg-black aspect-video rounded-lg ${className}`}
    >
      <iframe
        src={video.embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
