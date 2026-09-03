"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    label: "Hall of Fame",
    items: [
      { label: "Manage Profiles", href: "/admin/profiles" },
      { label: "Add Profile", href: "/admin/profiles/new" },
      { label: "Profile Categories", href: "/admin/categories" },
      { label: "Claim Profile", href: "/admin/claim" },
    ],
  },
  {
    label: "Content Pages",
    items: [
      { label: "About Us", href: "/admin/pages/about" },
      { label: "Our Mission", href: "/admin/pages/mission" },
    ],
  },
  {
    label: "Pakistani Businesses",
    items: [
      { label: "Manage Businesses", href: "/admin/business" },
      { label: "Add Business", href: "/admin/business/new" },
      { label: "Business Categories", href: "/admin/business-categories" },
    ],
  },
  {
    label: "Pakistani Products",
    items: [
      { label: "Manage Products", href: "/admin/products" },
      { label: "Add Product", href: "/admin/products/new" },
      { label: "Product Categories", href: "/admin/product-categories" },
    ],
  },
  {
    label: "Stories & Blog",
    items: [
      { label: "Manage Stories", href: "/admin/stories" },
      { label: "Blog Posts", href: "/admin/blog" },
    ],
  },
  {
    label: "Pride TV",
    items: [{ label: "Manage Videos", href: "/admin/media" }],
  },
];

// Icons for each group label
const GROUP_ICONS: Record<string, JSX.Element> = {
  Overview: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  "Hall of Fame": (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  "Content Pages": (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  "Pakistani Businesses": (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  "Pakistani Products": (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  "Stories & Blog": (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  "Pride TV": (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect width="15" height="14" x="1" y="5" rx="2" />
    </svg>
  ),
};

export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleGroup(label: string) {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b lg:hidden bg-green border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-md bg-gold">
            <span className="text-white font-bold text-[10px] font-display">
              P
            </span>
          </div>
          <span className="text-sm font-bold text-white font-display">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-1.5 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-green z-50 flex flex-col
        transition-transform duration-300
        lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex-shrink-0 px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gold">
              <span className="text-sm font-bold text-white font-display">
                P
              </span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-white font-display">
                Pride of Pakistan
              </p>
              <p className="text-[10px] text-gold/80 font-body mt-0.5 uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsed[group.label];
            const hasActive = group.items.some((i) => pathname === i.href);

            return (
              <div key={group.label} className="mb-0.5">
                {/* Group header — clickable to collapse */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center justify-between w-full px-4 py-2 text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`transition-colors ${hasActive ? "text-gold" : "text-white/40 group-hover:text-white/60"}`}
                    >
                      {GROUP_ICONS[group.label]}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[.14em] font-body transition-colors ${
                        hasActive
                          ? "text-gold"
                          : "text-white/40 group-hover:text-white/60"
                      }`}
                    >
                      {group.label}
                    </span>
                  </div>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-white/30 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* Group items */}
                {!isCollapsed && (
                  <div className="pb-1">
                    {group.items.map(({ label, href }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2 mx-2 rounded-lg text-[13px] font-medium font-body transition-all no-underline ${
                            isActive
                              ? "bg-white/15 text-white font-semibold"
                              : "text-white/60 hover:bg-white/8 hover:text-white/90"
                          }`}
                        >
                          {/* Active indicator dot */}
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                              isActive ? "bg-gold" : "bg-transparent"
                            }`}
                          />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/10">
          {/* Footer links */}
          <div className="px-3 py-3 space-y-0.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body text-white/60 hover:bg-white/10 hover:text-white transition-colors no-underline"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              View Site
            </Link>
            <Link
              href="/admin/settings"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body transition-colors no-underline ${
                pathname === "/admin/settings"
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
