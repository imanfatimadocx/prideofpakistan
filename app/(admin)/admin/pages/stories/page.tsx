import { getPageContent } from "@/app/lib/pageContent";
import PageHeroEditor from "../PageHeroEditor";

export const revalidate = 3600;

export default async function StoriesPageEditor() {
  const content = await getPageContent("page_stories");
  return (
    <div className="flex min-h-screen bg-cream">
      <main className="flex-1 p-4 lg:p-8">
        <PageHeroEditor
          section="page_stories"
          label="Your Stories Page"
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
