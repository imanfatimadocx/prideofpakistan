import Link from "next/link";

const GROUPS = [
  {
    title: "Page headings",
    desc: "The green banner at the top of each page.",
    pages: [
      { label: "Homepage", href: "/admin/homepage" },
      { label: "Who Is Who", href: "/admin/pages/whoiswho" },
      { label: "Pakistani Products", href: "/admin/pages/products" },
      { label: "Pakistani Businesses", href: "/admin/pages/businesses" },
      { label: "Discussion Forum", href: "/admin/pages/news" },
      { label: "Your Stories", href: "/admin/pages/stories" },
      { label: "Pride TV", href: "/admin/pages/pridetv" },
      { label: "Pride Team", href: "/admin/pages/team" },
      { label: "Our Sponsors", href: "/admin/pages/sponsors" },
    ],
  },
  {
    title: "Full pages",
    desc: "Pages where you can edit all the text.",
    pages: [
      { label: "About Us", href: "/admin/pages/about" },
      { label: "Our Mission", href: "/admin/pages/mission" },
      { label: "Contact Us", href: "/admin/pages/contact" },
      { label: "Terms & Conditions", href: "/admin/pages/legal/terms" },
      { label: "Privacy Policy", href: "/admin/pages/legal/privacy" },
      { label: "Disclaimer", href: "/admin/pages/legal/disclaimer" },
    ],
  },
];

export default function AdminPagesIndex() {
  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[900px]">
        <h1 className="mb-1 text-2xl font-bold font-display text-green">Pages</h1>
        <p className="mb-8 text-sm text-ink-muted font-body">Choose a page to edit.</p>
        <div className="space-y-8">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h2 className="text-base font-bold font-display text-green">{g.title}</h2>
              <p className="mb-3 text-xs text-ink-muted font-body">{g.desc}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.pages.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold no-underline bg-white border rounded-xl border-border text-ink-dark font-body hover:border-gold hover:text-gold transition-colors"
                  >
                    {p.label}
                    <span className="text-gold">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
