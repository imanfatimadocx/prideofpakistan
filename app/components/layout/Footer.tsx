import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-deep border-t-[3px] border-leaf text-white/80 py-12 sm:py-16 lg:pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-14 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center flex-shrink-0 mb-4">
              <Image
                src="/logo-light.png"
                alt="Pride of Pakistan"
                className="object-contain object-left w-auto h-20 sm:h-[88px]"
                width={293}
                height={128}
              />
            </Link>
            <p className="text-[13px] text-white/75 leading-relaxed max-w-[300px] font-body">
              All content on this website is copyrighted material of
              prideofpakistan.com. Please seek the written permission of site
              owner before copying anything from the website. If you find any
              problems/mistakes please contact the Webmaster by clicking{" "}
              <a href="/contact" className="text-sage underline">
                here
              </a>
              . Our staff will try to fix the problem as soon as possible.{" "}
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white font-display">
              Discover
            </h4>
            <ul className="space-y-2.5 list-none">
              {[
                { label: "Who Is Who", href: "/who-is-who" },
                { label: "Pakistani Products", href: "/products" },
                { label: "Your Stories", href: "/your-stories" },
                { label: "Discussion Forum", href: "/news" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/75 no-underline text-[13px] hover:text-sage transition-colors font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white font-display">
              Business
            </h4>
            <ul className="space-y-2.5 list-none">
              {[
                { label: "Submit Your Profile", href: "/submit-profile" },
                { label: "Pakistani Businesses", href: "/business" },
                { label: "List Your Business", href: "/list-business" },
                { label: "Our Sponsors", href: "/our-sponsors" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/75 no-underline text-[13px] hover:text-sage transition-colors font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white font-display">
              Join Us
            </h4>
            <ul className="space-y-2.5 list-none">
              {[
                { label: "Pride TV", href: "/pride-tv" },
                { label: "Pride Team", href: "/pride-team" },
                { label: "Contact Us", href: "/contact" },
                { label: "About Us", href: "/about" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/75 no-underline text-[13px] hover:text-sage transition-colors font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-3 text-xs text-white/60 font-body text-center sm:text-left">
          <span>© {year} Pride of Pakistan. All rights reserved.</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: "Terms of Use", href: "/terms-of-use" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Disclaimer", href: "/disclaimer" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs no-underline transition-colors text-white/60 hover:text-sage font-body"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
