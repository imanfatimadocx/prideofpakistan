import { getPageContent } from "@/app/lib/pageContent";
import { getContactInfo } from "@/app/lib/contactInfo";
import ContactPageClient from "./ContactPageClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [hero, info] = await Promise.all([
    getPageContent("page_contact"),
    getContactInfo(),
  ]);
  return <ContactPageClient hero={hero} info={info} />;
}
