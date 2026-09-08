import { getPageContent } from "@/app/lib/pageContent";
import ContactPageClient from "./ContactPageClient";


export default async function ContactPage() {
  const hero = await getPageContent("page_contact");
  return <ContactPageClient hero={hero} />;
}
