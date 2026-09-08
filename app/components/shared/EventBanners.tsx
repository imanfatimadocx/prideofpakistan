"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Banner {
  id: number;
  type: string;
  title: string | null;
  message: string;
  image: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  color: string;
}

const STRIP_COLORS: Record<string, string> = {
  green: "bg-green text-white",
  gold: "bg-gold text-white",
  red: "bg-red-600 text-white",
};

const STRIP_CLOSE: Record<string, string> = {
  green: "hover:bg-white/10",
  gold: "hover:bg-white/10",
  red: "hover:bg-white/10",
};

export default function EventBanners() {
  const [modal, setModal] = useState<Banner | null>(null);
  const [strip, setStrip] = useState<Banner | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stripOpen, setStripOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/banners");
        const banners = (await res.json()) as Banner[];

        const modalBanner = banners.find((b) => b.type === "modal") ?? null;
        const stripBanner = banners.find((b) => b.type === "strip") ?? null;

        if (modalBanner) {
          const dismissed = sessionStorage.getItem(
            `modal-dismissed-${modalBanner.id}`,
          );
          if (!dismissed) {
            setModal(modalBanner);
            setModalOpen(true);
          }
        }

        if (stripBanner) {
          const dismissed = localStorage.getItem(
            `strip-dismissed-${stripBanner.id}`,
          );
          if (!dismissed) {
            setStrip(stripBanner);
            setStripOpen(true);
          }
        }
      } catch {
        // silently fail — banners are non-critical
      }
    }
    load();
  }, []);

  function dismissModal() {
    if (modal) sessionStorage.setItem(`modal-dismissed-${modal.id}`, "1");
    setModalOpen(false);
  }

  function dismissStrip() {
    if (strip) localStorage.setItem(`strip-dismissed-${strip.id}`, "1");
    setStripOpen(false);
  }

  return (
    <>
      {/* ── Strip banner ── */}
      {strip && stripOpen && (
        <div
          className={`w-full ${STRIP_COLORS[strip.color] ?? STRIP_COLORS.green} relative`}
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-center gap-4">
            <p className="flex-1 text-sm font-semibold text-center font-body">
              {strip.message}
              {strip.ctaLink && strip.ctaLabel && (
                <>
                  {" "}
                  <Link
                    href={strip.ctaLink}
                    className="ml-1 font-bold underline hover:no-underline"
                  >
                    {strip.ctaLabel} →
                  </Link>
                </>
              )}
            </p>
            <button
              onClick={dismissStrip}
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${STRIP_CLOSE[strip.color]}`}
              aria-label="Dismiss"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Modal banner ── */}
      {modal && modalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={dismissModal}
          />

          {/* Modal */}
          <div className="relative z-10 bg-white rounded-2xl overflow-hidden max-w-[540px] w-full shadow-2xl">
            {/* Image */}
            {modal.image && (
              <div
                className="w-full overflow-hidden"
                style={{ aspectRatio: "540/280" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={modal.image}
                  alt={modal.title ?? ""}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Close */}
              <button
                onClick={dismissModal}
                className="absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full top-4 right-4 bg-black/10 hover:bg-black/20"
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Green top bar */}
              <div className="w-10 h-1 mb-4 rounded bg-gold" />

              {modal.title && (
                <h2 className="mb-3 text-2xl font-bold font-display text-green">
                  {modal.title}
                </h2>
              )}
              <p className="mb-6 text-sm leading-relaxed text-ink-mid font-body">
                {modal.message}
              </p>

              <div className="flex items-center gap-3">
                {modal.ctaLink && modal.ctaLabel && (
                  <Link
                    href={modal.ctaLink}
                    onClick={dismissModal}
                    className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
                  >
                    {modal.ctaLabel}
                  </Link>
                )}
                <button
                  onClick={dismissModal}
                  className="text-sm font-semibold transition-colors text-ink-muted font-body hover:text-ink-dark"
                >
                  {modal.ctaLink ? "Maybe later" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
