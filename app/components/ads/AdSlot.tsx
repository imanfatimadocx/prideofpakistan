import { AD_SLOTS, getSlotPayload, type AdSlotKey } from "@/app/lib/ads";
import AdView from "./AdView";

/**
 * An ad space inside a page. Decides on the server whether to show a sponsor ad,
 * a Google ad or nothing, using the settings in Admin > Advertising.
 * When nothing is shown, nothing is rendered (no empty gap).
 *
 * <AdSlot slot="profile" className="mt-10" />
 * <AdSlot slot="home_top" section />   // full-width band with the site's container
 */
export default async function AdSlot({
  slot,
  className = "",
  section = false,
}: {
  slot: AdSlotKey;
  className?: string;
  section?: boolean;
}) {
  const payload = await getSlotPayload(slot);
  if (payload.show === "none") return null;
  const view = <AdView payload={payload} kind={AD_SLOTS[slot].kind} className={className} />;
  if (!section) return view;
  return (
    <section aria-label="Advertisement" className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">{view}</div>
    </section>
  );
}
