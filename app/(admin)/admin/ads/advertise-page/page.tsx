import { getAdvertisePage } from "@/app/lib/advertisePage";
import AdvertisePageClient from "./AdvertisePageClient";

export const dynamic = "force-dynamic";

export default async function AdminAdvertisePage() {
  const page = await getAdvertisePage();
  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[900px]">
        <h1 className="mb-1 text-2xl font-bold font-display text-green">&ldquo;Advertise with Us&rdquo; page</h1>
        <p className="mb-8 text-sm text-ink-muted font-body">
          The public page where businesses learn about advertising and get in touch. Enquiries from its form arrive in Contact Queries.
        </p>
        <AdvertisePageClient page={page} />
      </div>
    </div>
  );
}
