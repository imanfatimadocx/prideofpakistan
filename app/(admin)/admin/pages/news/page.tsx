import { getPageContent } from "@/app/lib/pageContent";
import PageHeroEditor from "../PageHeroEditor";

export const dynamic = "force-dynamic";

export default async function NewsPageEditor() {
  const content = await getPageContent("page_news");
  return (
    <div className="flex min-h-screen bg-cream">
      <main className="flex-1 p-4 lg:p-8">
        <PageHeroEditor
          section="page_news"
          label="Discussion Forum Page"
          initial={{
            eyebrow: content.eyebrow,
            heading: content.heading,
            subtext: content.subtext,
          }}
        />
      </main>
    </div>
  );
}
