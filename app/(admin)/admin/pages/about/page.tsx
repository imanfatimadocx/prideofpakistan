import AdminNav from "@/app/components/admin/AdminNav";
import { prisma } from "@/app/lib/prisma";
import PageContentClient from "../PageContentClient";

export const revalidate = 0;

const DEFAULT_IMAGES = [
  {
    src: "/5.jpeg",
    caption:
      "Imtiaz Ahmad interviewing Prime Minister of Pakistan Zulfikar Ali Bhutto",
  },
  {
    src: "/2.jpeg",
    caption:
      "Imtiaz Ahmad receiving award from HRH Prince Charles (now King Charles III)",
  },
  {
    src: "/3.jpeg",
    caption: "Imtiaz Ahmad with Prime Minister of United Kingdom John Major",
  },
  {
    src: "/4.jpeg",
    caption:
      "From left: Hanif Raja, Wajid S. U. Hussan, Tony Blair, M. Shoaib, Imtiaz Ahmad and M Sarwar MP",
  },
  {
    src: "/1.jpeg",
    caption: "Imtiaz Ahmad with Mohammad Sarwar, Governor of Punjab",
  },
  {
    src: "/6.jpeg",
    caption: "Imtiaz Ahmad with Mohammad Sarwar, Governor of Punjab",
  },
];

export default async function AdminAboutPage() {
  const record = await prisma.pageContent.findUnique({
    where: { page: "about" },
  });
  const content = (record?.content as Record<string, unknown> | null) ?? {};
  const images =
    (content._images as { src: string; caption: string }[] | undefined) ??
    DEFAULT_IMAGES;

  const textContent: Record<string, string> = {
    heading1: (content.heading1 as string) || "About the Founder",
    body1a: (content.body1a as string) || "",
    body1b: (content.body1b as string) || "",
    quote:
      (content.quote as string) || "Let's change the narrative - together.",
    body1c: (content.body1c as string) || "",
    heading2: (content.heading2 as string) || "Building the Pride Team",
    body2a: (content.body2a as string) || "",
    body2b: (content.body2b as string) || "",
    body2c: (content.body2c as string) || "",
  };

  return (
    <div className="flex min-h-screen bg-cream pt-14">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 lg:pt-0 lg:p-8">
        <div className="max-w-[700px]">
          <h1 className="mb-1 text-2xl font-bold font-display text-green">
            About Us Page
          </h1>
          <p className="mb-8 text-sm text-ink-muted font-body">
            Edit the text and images on the About Us page.
          </p>
          <PageContentClient
            page="about"
            initial={textContent}
            initialImages={images}
            fields={[
              { key: "heading1", label: "First Heading", type: "text" },
              { key: "body1a", label: "Paragraph 1", type: "textarea" },
              { key: "body1b", label: "Paragraph 2", type: "textarea" },
              { key: "quote", label: "Pull Quote", type: "text" },
              { key: "body1c", label: "Paragraph 3", type: "textarea" },
              { key: "heading2", label: "Second Heading", type: "text" },
              { key: "body2a", label: "Paragraph 4", type: "textarea" },
              { key: "body2b", label: "Paragraph 5", type: "textarea" },
              { key: "body2c", label: "Paragraph 6", type: "textarea" },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
