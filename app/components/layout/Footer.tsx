import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-green text-white/[.68] py-12 sm:py-16 lg:pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-14 mb-10 sm:mb-13">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center flex-shrink-0 mb-4">
              <Image
                src="/logo-new.jpeg"
                alt="Pride of Pakistan"
                className="object-contain"
                width={160}
                height={160}
              />
            </Link>
            <p className="text-[13px] text-white/50 leading-relaxed max-w-[260px] font-body">
              Celebrating the people, places, businesses, and culture that make Pakistan extraordinary.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white font-display">Discover</h4>
            <ul className="space-y-2.5 list-none">
              {[
                { label: 'Who Is Who',        href: '/who-is-who' },
                { label: 'Cities & Towns',     href: '/cities' },
                { label: 'Pakistani Products', href: '/products' },
                { label: 'Pride Blog',         href: '/pride-blog' },
                { label: 'Top Stories',        href: '/top-stories' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/[.48] no-underline text-[13px] hover:text-gold-light transition-colors font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white font-display">Business</h4>
            <ul className="space-y-2.5 list-none">
              {[
                { label: 'Business Directory', href: '/business' },
                { label: 'List Your Business',  href: '/list-business' },
                { label: 'Advertise',           href: '#' },
                { label: 'Partnerships',        href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/[.48] no-underline text-[13px] hover:text-gold-light transition-colors font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white font-display">Join Us</h4>
            <ul className="space-y-2.5 list-none">
              {[
                { label: 'Submit Your Profile', href: '/submit-profile' },
                { label: 'Pride TV',            href: '/pride-tv' },
                { label: 'Contact Us',          href: '#' },
                { label: 'About',               href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/[.48] no-underline text-[13px] hover:text-gold-light transition-colors font-body">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/[.32] font-body text-center sm:text-left">
          <span>© {year} Pride of Pakistan. All rights reserved.</span>
          <span>Powered by rasekh.pk</span>
        </div>
      </div>
    </footer>
  )
}