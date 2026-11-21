import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";
import { pageMeta } from "@/app/lib/seo";
import { getAdvertisePage } from "@/app/lib/advertisePage";
import { AD_SLOTS, AD_SLOT_KEYS, AD_SIZES } from "@/app/lib/ads";
import AdvertiseEnquiry from "./AdvertiseEnquiry";

export const dynamic = "force-dynamic";

export const metadata = pageMeta({
  title: "Advertise with Us",
  description: "Advertise your business on Pride of Pakistan and reach the Pakistani community in the UK, Pakistan and worldwide.",
  path: "/advertise",
});

export default async function AdvertisePage() {
  const c = await getAdvertisePage();
  const spaces = AD_SLOT_KEYS.map((k) => ({
    name: AD_SLOTS[k].label,
    where: AD_SLOTS[k].where,
    size: AD_SLOTS[k].kind === "showcase" ? AD_SIZES.square : `${AD_SIZES.desktop} (mobile ${AD_SIZES.mobile})`,
  }));
  const wa = c.whatsapp
    ? `https://wa.me/${c.whatsapp}?text=${encodeURIComponent("Assalam o Alaikum, I'd like to advertise on Pride of Pakistan.")}`
    : null;

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero eyebrow={c.eyebrow} title={c.heading} subtitle={c.subtext} />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-14">
          {/* Intro + contact */}
          <section className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <h2 className="mb-3 text-2xl font-bold font-display sm:text-3xl text-green">Why advertise with us</h2>
              <div className="w-12 h-[3px] bg-leaf rounded mb-5" />
              <p className="leading-relaxed whitespace-pre-line text-ink-mid font-body">{c.intro}</p>
              <h3 className="mt-8 mb-3 text-lg font-bold font-display text-green">Who visits Pride of Pakistan</h3>
              <ul className="space-y-2">
                {c.audience.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-ink-mid font-body">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-leaf" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="self-start p-6 space-y-4 bg-white border rounded-xl border-border">
              <h2 className="text-lg font-bold font-display text-green">Get in touch</h2>
              <p className="text-sm text-ink-mid font-body">Talk to us about prices, dates and the best space for your business.</p>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full gap-2 py-3 text-sm font-semibold text-white no-underline rounded-md bg-leaf font-body hover:bg-leaf-dark">
                  WhatsApp us
                </a>
              )}
              <a href={`mailto:${c.email}?subject=${encodeURIComponent("Advertising on Pride of Pakistan")}`} className="flex items-center justify-center w-full gap-2 py-3 text-sm font-semibold no-underline border rounded-md text-green border-sage bg-mint font-body hover:bg-sage">
                Email {c.email}
              </a>
              <a href="#enquiry" className="block text-sm font-semibold text-center no-underline text-leaf-dark font-body hover:underline">
                Or send an enquiry below ↓
              </a>
            </aside>
          </section>

          {/* Ad spaces */}
          <section>
            <h2 className="mb-3 text-2xl font-bold font-display sm:text-3xl text-green">Where your ad can appear</h2>
            <div className="w-12 h-[3px] bg-leaf rounded mb-6" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((s) => (
                <div key={s.name} className="p-5 bg-white border rounded-xl border-border">
                  <p className="font-bold font-display text-green">{s.name}</p>
                  <p className="mt-1 text-sm text-ink-mid font-body">{s.where}</p>
                  <p className="mt-3 text-xs font-semibold text-slate font-body">Poster size: {s.size}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-mid font-body">{c.note}</p>
          </section>

          {/* Enquiry */}
          <section id="enquiry" className="max-w-[760px] scroll-mt-28">
            <AdvertiseEnquiry spaces={spaces.map((s) => s.name)} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
