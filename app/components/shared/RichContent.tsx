import "@/app/styles/rich-content.css";

/** Renders HTML that was sanitised on save (see app/lib/sanitize.ts). */
export default function RichContent({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  if (!html) return null;
  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
