"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";

export default function SubmitProfilePage() {
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch("/api/submit-profile", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Submission failed.");
        return;
      }
      setSubmitted(true);
      form.reset();
      setPreview(null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <>
        <Topbar />
        <Navbar />
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <p className="text-sm text-ink-muted font-body">Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Topbar />
        <Navbar />
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="font-display text-2xl font-bold text-green mb-3">
              Login Required
            </h2>
            <p className="text-sm text-ink-muted font-body mb-6">
              You need to be logged in to submit a profile.
            </p>
            <Link
              href="/login?redirect=/submit-profile"
              className="bg-gold text-white px-6 py-3 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
            >
              Log In
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Join the Hall of Fame"
          title="Submit Your Profile"
          subtitle="Share your story with Pakistan. Submissions are reviewed by our team before appearing on the site."
        />
        <section className="py-12 bg-cream sm:py-16 lg:py-20">
          <div className="max-w-[700px] mx-auto px-4 sm:px-8 lg:px-12">
            {submitted ? (
              <div className="p-8 text-center bg-white border border-border rounded-xl">
                <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="mb-2 text-2xl font-bold font-display text-green">
                  Thank You!
                </h2>
                <p className="leading-relaxed text-ink-muted font-body mb-6">
                  Your profile has been submitted for review. You can track its
                  status in your dashboard.
                </p>
                <Link
                  href="/dashboard"
                  className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
                >
                  View Dashboard
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5 bg-white border border-border rounded-xl sm:p-8"
              >
                {/* Hidden session email for dashboard tracking */}
                <input
                  type="hidden"
                  name="submitterEmail"
                  value={session.user?.email ?? ""}
                />

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Full Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Dr. Abdus Salam"
                  />
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Profession / Title <span className="text-gold">*</span>
                  </label>
                  <input
                    name="Profession"
                    type="text"
                    required
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Physicist, Athlete, Entrepreneur"
                  />
                </div>

                {/* City + Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      City
                    </label>
                    <input
                      name="City"
                      type="text"
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                      placeholder="e.g. Lahore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Country
                    </label>
                    <input
                      name="Country"
                      type="text"
                      defaultValue="Pakistan"
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Email <span className="text-gold">*</span>
                  </label>
                  <input
                    name="Email"
                    type="email"
                    required
                    defaultValue={session.user?.email ?? ""}
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Short Bio <span className="text-gold">*</span>
                  </label>
                  <textarea
                    name="shortdesc"
                    required
                    rows={5}
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us about your achievements and background..."
                  />
                </div>

                {/* Photo */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Profile Photo
                  </label>
                  {preview && (
                    <div className="mb-3 w-32 h-32 overflow-hidden rounded-full border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors file:bg-gold-pale file:text-gold file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:text-xs file:font-semibold file:cursor-pointer"
                  />
                  <p className="text-xs text-ink-muted font-body mt-1">
                    Uploaded securely to Cloudinary.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-body">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Submit Profile for Review"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
