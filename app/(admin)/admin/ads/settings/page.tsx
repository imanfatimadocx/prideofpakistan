import Link from "next/link";
import { AD_SLOTS, AD_SLOT_KEYS, getAdSettings } from "@/app/lib/ads";
import { getAdvertisePage } from "@/app/lib/advertisePage";
import AdSettingsClient from "./AdSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdSettingsPage() {
  const [settings, page] = await Promise.all([getAdSettings(), getAdvertisePage()]);
  const slots = AD_SLOT_KEYS.map((k) => ({ key: k, label: AD_SLOTS[k].label, where: AD_SLOTS[k].where }));

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[900px]">
        <Link href="/admin/ads" className="text-sm no-underline text-leaf-dark font-body hover:underline">
          ← Advertisements
        </Link>
        <h1 className="mt-3 mb-1 text-2xl font-bold font-display text-green">Ad spaces &amp; settings</h1>
        <p className="mb-8 text-sm text-ink-muted font-body">
          Choose, for each space on the website, whether it shows your own sponsor ads or a Google ad.
        </p>
        <AdSettingsClient settings={settings} slots={slots} page={page} />
      </div>
    </div>
  );
}
