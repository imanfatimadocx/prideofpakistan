"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@/app/styles/rich-content.css";

/**
 * Reusable rich-text editor for admin forms.
 * Uncontrolled: pass the starting HTML once, receive updates via onChange.
 * To load different content, change the component's `key`.
 */
export default function RichEditor({
  value,
  onChange,
  minHeight = 160,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "rich-content max-w-none focus:outline-none font-body text-ink-dark leading-relaxed p-4 text-sm",
        style: `min-height:${minHeight}px`,
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  function run(action: () => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(
      "Link address (e.g. https://example.com or mailto:info@prideofpakistan.com). Leave empty to remove.",
      previous ?? "https://",
    );
    if (url === null) return;
    if (url.trim() === "" || url.trim() === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  const btn = (active: boolean) =>
    `px-2.5 py-1 rounded text-xs font-body transition-colors ${
      active ? "bg-green text-white" : "text-ink-mid hover:bg-border"
    }`;
  const divider = <div className="w-px h-4 mx-1 bg-border" />;

  return (
    <div className="overflow-hidden bg-white border border-border rounded-xl">
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-cream">
        <button type="button" title="Heading" onClick={run(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())} className={`${btn(!!editor?.isActive("heading", { level: 2 }))} font-bold`}>H2</button>
        <button type="button" title="Sub-heading" onClick={run(() => editor?.chain().focus().toggleHeading({ level: 3 }).run())} className={`${btn(!!editor?.isActive("heading", { level: 3 }))} font-bold`}>H3</button>
        {divider}
        <button type="button" title="Bold" onClick={run(() => editor?.chain().focus().toggleBold().run())} className={`${btn(!!editor?.isActive("bold"))} font-bold`}>B</button>
        <button type="button" title="Italic" onClick={run(() => editor?.chain().focus().toggleItalic().run())} className={`${btn(!!editor?.isActive("italic"))} italic`}>I</button>
        <button type="button" title="Underline" onClick={run(() => editor?.chain().focus().toggleUnderline().run())} className={`${btn(!!editor?.isActive("underline"))} underline`}>U</button>
        {divider}
        <button type="button" title="Bullet list" onClick={run(() => editor?.chain().focus().toggleBulletList().run())} className={btn(!!editor?.isActive("bulletList"))}>• List</button>
        <button type="button" title="Numbered list" onClick={run(() => editor?.chain().focus().toggleOrderedList().run())} className={btn(!!editor?.isActive("orderedList"))}>1. List</button>
        <button type="button" title="Quote" onClick={run(() => editor?.chain().focus().toggleBlockquote().run())} className={btn(!!editor?.isActive("blockquote"))}>“ Quote</button>
        {divider}
        <button type="button" title="Add or edit link" onClick={run(setLink)} className={btn(!!editor?.isActive("link"))}>Link</button>
        {divider}
        <button type="button" title="Undo" onClick={run(() => editor?.chain().focus().undo().run())} className={btn(false)}>↩</button>
        <button type="button" title="Redo" onClick={run(() => editor?.chain().focus().redo().run())} className={btn(false)}>↪</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
