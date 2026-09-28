import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import RichContent from "@/app/components/shared/RichContent";
import { getLegalContent, type LegalPageSlug } from "@/app/lib/legalContent";

/** Public page for Terms / Privacy / Disclaimer, content managed in the admin panel. */
export default async function LegalPage({ slug }: { slug: LegalPageSlug }) {
  const content = await getLegalContent(slug);
  const sections = content.sections.filter((s) => !s.hidden);

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">
          <h1 className="mb-2 text-3xl font-bold font-display text-green">{content.title}</h1>
          <div className="w-12 h-[3px] bg-gold rounded mb-3" />
          {content.updatedAt && (
            <p className="mb-8 text-xs text-ink-muted font-body">
              Last updated{" "}
              {new Date(content.updatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          {!content.updatedAt && <div className="mb-5" />}

          <div className="text-sm text-ink-mid font-body">
            <RichContent html={content.intro} className="mb-7" />
            <div className="space-y-7">
              {sections.map((s) => (
                <section key={s.id}>
                  {s.heading && (
                    <h2 className="mb-2 text-base font-bold font-display text-green">{s.heading}</h2>
                  )}
                  <RichContent html={s.html} />
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
