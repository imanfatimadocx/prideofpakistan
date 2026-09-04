import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import SubmitStoryForm from "./SubmitStoryForm";

export default async function SubmitStoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
          <h1 className="font-display text-3xl font-bold text-green mb-2">
            Share Your Story
          </h1>
          <p className="text-sm text-ink-muted font-body mb-8">
            Your story will be reviewed before it appears on the site.
          </p>
          <SubmitStoryForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
