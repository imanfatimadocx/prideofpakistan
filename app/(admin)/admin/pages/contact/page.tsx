import { getPageContent } from "@/app/lib/pageContent";
import { getContactInfo } from "@/app/lib/contactInfo";
import PageHeroEditor from "../PageHeroEditor";
import ContactInfoEditor from "./ContactInfoEditor";

export const dynamic = "force-dynamic";

export default async function ContactPageEditor() {
  const [hero, info] = await Promise.all([
    getPageContent("page_contact"),
    getContactInfo(),
  ]);

  return (
    <div className="p-4 lg:p-8">
      <PageHeroEditor
        section="page_contact"
        label="Contact Page"
        initial={{
          eyebrow: hero.eyebrow,
          heading: hero.heading,
          subtext: hero.subtext,
        }}
      />
      <ContactInfoEditor initial={info} />
    </div>
  );
}
