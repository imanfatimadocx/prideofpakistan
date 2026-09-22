import AdminNav from "@/app/components/admin/AdminNav";
import { getPageContent } from "@/app/lib/pageContent";
import PageHeroEditor from "../PageHeroEditor";

export const revalidate = 3600;

export default async function ContactPageEditor() {
  const content = await getPageContent("page_contact");
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <main className="flex-1 p-4 lg:ml-64 pt-14 lg:pt-0 lg:p-8">
        <PageHeroEditor
          section="page_contact"
          label="Contact Page"
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
