import Link from "next/link";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main className="flex items-center justify-center min-h-screen px-4 bg-cream">
        <div className="text-center max-w-[500px]">
          <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold mb-4 font-body">
            Pride of Pakistan
          </p>
          <h1 className="mb-4 text-5xl font-black font-display sm:text-6xl text-green">
            Coming Soon
          </h1>
          <div className="w-12 h-[3px] bg-gold mx-auto mb-6 rounded" />
          <p className="mb-8 leading-relaxed text-ink-muted font-body">
            This page is coming soon. We're working hard to bring it to you.
            Check back shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white no-underline transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
