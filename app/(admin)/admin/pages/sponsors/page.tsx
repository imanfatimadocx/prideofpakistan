import { getPageContent } from "@/app/lib/pageContent";
import PageHeroEditor from "../PageHeroEditor";

export const dynamic = "force-dynamic";

export default async function Editor() {
  const content = await getPageContent("page_sponsors");
  return (
    <div className="p-4 lg:p-8">
      <PageHeroEditor
        section="page_sponsors"
        label="Our Sponsors Page"
        initial={{
          eyebrow: content.eyebrow,
          heading: content.heading,
          subtext: content.subtext,
        }}
      />
    </div>
  );
}
