// One-time script: adds the small pieces of the new features to files you
// already have (schema, business pages, homepage, footer...).
// Safe to run more than once - edits that are already there are skipped.
//
//   node scripts/apply-feature-edits.mjs
//
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const edits = [
  // ── prisma/schema.prisma ─────────────────────────────────────────────
  {
    file: "prisma/schema.prisma",
    name: "Business.video_url column",
    done: /video_url\s+String/,
    find: /\n(\s*@@map\("busniss"\))/,
    replace:
      '\n  video_url           String            @default("") @db.VarChar(500)\n$1',
  },
  {
    file: "prisma/schema.prisma",
    name: "Sponsor.website + sortOrder columns",
    done: /model Sponsor \{[^}]*website/,
    find: /(model Sponsor \{[^}]*?)(\n\s*@@map\("sponsors"\))/,
    replace:
      '$1\n  website    String @default("") @db.VarChar(500)\n  sortOrder  Int    @default(0)$2',
  },
  {
    file: "prisma/schema.prisma",
    name: "VideoCategory model",
    done: /model VideoCategory/,
    find: /\s*$/,
    replace:
      '\n\nmodel VideoCategory {\n  id        Int    @id @default(autoincrement())\n  name      String @db.VarChar(100)\n  sortOrder Int    @default(0)\n  status    Int    @default(1)\n\n  @@map("video_categories")\n}\n',
  },

  // ── app/lib/pageContent.ts ───────────────────────────────────────────
  {
    file: "app/lib/pageContent.ts",
    name: "Hero defaults for Sponsors & Pride Team pages",
    done: /page_sponsors/,
    find: /(const FALLBACKS: Record<string, PageHeroContent> = \{\n)/,
    replace:
      '$1  page_sponsors: {\n    eyebrow: "Our Supporters",\n    heading: "Our Sponsors",\n    subtext:\n      "The organisations and businesses that help Pride of Pakistan share the best of Pakistan with the world.",\n  },\n  page_team: {\n    eyebrow: "The People Behind It",\n    heading: "Pride Team",\n    subtext:\n      "A growing network of people who believe in a brighter future for Pakistan.",\n  },\n',
  },

  // ── Admin business edit page ─────────────────────────────────────────
  {
    file: "app/(admin)/admin/business/[id]/edit/page.tsx",
    name: "Import BusinessVideoField",
    done: /BusinessVideoField from/,
    find: /(import BusinessEditClient from "\.\/BusinessEditClient";?\n)/,
    replace: '$1import BusinessVideoField from "./BusinessVideoField";\n',
  },
  {
    file: "app/(admin)/admin/business/[id]/edit/page.tsx",
    name: "Show video field under the business form",
    done: /<BusinessVideoField/,
    find: /(\n)([ \t]*)(<BusinessEditClient business=\{serialized\} categories=\{cats\} \/>)/,
    replace:
      '$1$2$3\n$2<BusinessVideoField businessId={biz.id} initial={biz.video_url ?? ""} />',
  },

  // ── Public business page ─────────────────────────────────────────────
  {
    file: "app/(public)/business/[id]/page.tsx",
    name: "Import VideoEmbed",
    done: /VideoEmbed from/,
    find: /(import CommentSection from "@\/app\/components\/shared\/CommentSection";?\n)/,
    replace: '$1import VideoEmbed from "@/app/components/shared/VideoEmbed";\n',
  },
  {
    file: "app/(public)/business/[id]/page.tsx",
    name: "Video card on the business page",
    done: /<VideoEmbed/,
    find: /(\n)([ \t]*)(\{\/\* Basic Information \*\/\})/,
    replace:
      '$1$2{/* Video */}\n$2{biz.video_url && (\n$2  <div className="overflow-hidden bg-white border border-border rounded-xl">\n$2    <div className="px-5 py-3 border-b bg-green/10 border-border">\n$2      <h2 className="text-sm font-bold tracking-wide uppercase text-green font-display">\n$2        Video\n$2      </h2>\n$2    </div>\n$2    <div className="p-4">\n$2      <VideoEmbed url={biz.video_url} title={`${biz.company_name} video`} />\n$2    </div>\n$2  </div>\n$2)}\n\n$2$3',
  },

  // ── List your business (public form) ────────────────────────────────
  {
    file: "app/(public)/list-business/ListBusinessClient.tsx",
    name: "Video link field on the List Business form",
    done: /name="video_url"/,
    find: /(name="site_url"[^>]*?\/>\s*<\/div>\n)/,
    replace:
      '$1\n                {/* Video */}\n                <div>\n                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">\n                    Business Video\n                  </label>\n                  <input\n                    name="video_url"\n                    type="text"\n                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"\n                    placeholder="https://www.youtube.com/watch?v=..."\n                  />\n                  <p className="text-xs text-ink-muted font-body mt-1.5">\n                    Optional. Paste a YouTube or Vimeo link and it will play on\n                    your business page.\n                  </p>\n                </div>\n',
  },
  {
    file: "app/api/list-business/route.ts",
    name: "Import video parser",
    done: /parseVideoUrl/,
    find: /(import \{ v2 as cloudinary \} from "cloudinary";?\n)/,
    replace: '$1import { parseVideoUrl } from "@/app/lib/video";\n',
  },
  {
    file: "app/api/list-business/route.ts",
    name: "Validate the submitted video link",
    done: /const videoRaw/,
    find: /(\n)([ \t]*)(const imageFileRaw = formData\.get\("image"\);)/,
    replace:
      '$1$2const videoRaw = ((formData.get("video_url") as string) || "").trim();\n$2const video = videoRaw ? parseVideoUrl(videoRaw) : null;\n$2if (videoRaw && !video) {\n$2  return NextResponse.json(\n$2    { error: "The video link must be a YouTube or Vimeo link." },\n$2    { status: 400 },\n$2  );\n$2}\n\n$2$3',
  },
  {
    file: "app/api/list-business/route.ts",
    name: "Save the video link",
    done: /video_url: video/,
    find: /(\n)([ \t]*)(lat: "",\n)/,
    replace: '$1$2$3$2video_url: video?.watchUrl ?? "",\n',
  },

  // ── Homepage + footer ────────────────────────────────────────────────
  {
    file: "app/page.tsx",
    name: "Import SponsorsSection",
    done: /SponsorsSection from/,
    find: /(import PrideTVSection[^\n]*\n)/,
    replace:
      '$1import SponsorsSection from "@/app/components/home/SponsorsSection";\n',
  },
  {
    file: "app/page.tsx",
    name: "Sponsors strip on the homepage",
    done: /<SponsorsSection/,
    find: /(\n)([ \t]*)(<PrideTVSection[^\n]*\/>)/,
    replace: "$1$2$3\n$2<SponsorsSection />",
  },
  {
    file: "app/components/layout/Footer.tsx",
    name: "Pride Team link in the footer",
    done: /\/pride-team/,
    find: /(\n)([ \t]*)(\{ label: "Pride TV", href: "\/pride-tv" \},)/,
    replace: '$1$2$3\n$2{ label: "Pride Team", href: "/pride-team" },',
  },
];

let failed = 0;
const cache = new Map();

for (const e of edits) {
  if (!existsSync(e.file)) {
    console.log(`✗ ${e.name}\n    file not found: ${e.file}`);
    failed++;
    continue;
  }
  if (!cache.has(e.file)) {
    const raw = readFileSync(e.file, "utf8");
    cache.set(e.file, {
      crlf: raw.includes("\r\n"),
      text: raw.replace(/\r\n/g, "\n"),
      changed: false,
    });
  }
  const f = cache.get(e.file);
  if (e.done.test(f.text)) {
    console.log(`• ${e.name} (already there)`);
    continue;
  }
  if (!e.find.test(f.text)) {
    console.log(
      `✗ ${e.name}\n    couldn't find the spot in ${e.file} - add it by hand (see INSTALL.md)`,
    );
    failed++;
    continue;
  }
  f.text = f.text.replace(e.find, e.replace);
  f.changed = true;
  console.log(`✓ ${e.name}`);
}

for (const [file, f] of cache) {
  if (f.changed)
    writeFileSync(
      file,
      f.crlf ? f.text.replace(/\n/g, "\r\n") : f.text,
      "utf8",
    );
}

console.log(
  failed ? `\n${failed} edit(s) need doing by hand.` : "\nAll edits applied.",
);
process.exit(failed ? 1 : 0);
