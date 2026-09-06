"use client";
import { useState } from "react";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ListBusinessPage() {
  const { data: session } = useSession();
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
      const res = await fetch("/api/list-business", {
        // ← fixed endpoint
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
              You need to be logged in to list a business.
            </p>
            <Link
              href="/login?redirect=/list-business"
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
          eyebrow="Grow Your Reach"
          title="List Your Business"
          subtitle="Join Pakistan's premier Pakistani Businesses and connect with customers across the country and abroad."
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
                  Your business has been submitted for review. You can track its
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
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Company Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="company_name"
                    type="text"
                    required
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Innovation Excellence Pvt Ltd"
                  />
                </div>

                {/* Name + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Your Name <span className="text-gold">*</span>
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Last Name
                    </label>
                    <input
                      name="l_name"
                      type="text"
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Email — pre-filled from session, hidden */}
                <input
                  type="hidden"
                  name="email"
                  value={session.user?.email ?? ""}
                />

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {/* City + Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      City <span className="text-gold">*</span>
                    </label>
                    <input
                      name="city"
                      type="text"
                      required
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Country
                    </label>
                    <input
                      name="country"
                      type="text"
                      defaultValue="Pakistan"
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Website
                  </label>
                  <input
                    name="site_url"
                    type="text"
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="https://"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Short Description <span className="text-gold">*</span>
                  </label>
                  <textarea
                    name="shortdesc"
                    required
                    rows={3}
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="One or two sentences about what your business does…"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Full Description
                  </label>
                  <textarea
                    name="company_description"
                    rows={5}
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us more about your business, services, history…"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Logo / Photo
                  </label>
                  {preview && (
                    <div
                      className="mb-3 w-full overflow-hidden rounded-lg border border-border"
                      style={{ aspectRatio: "600/350" }}
                    >
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
                    Best size: 600 × 350px.
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
                  {loading ? "Submitting…" : "Submit for Review"}
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
