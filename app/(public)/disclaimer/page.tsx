import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const metadata = {
  title: 'Disclaimer | Pride of Pakistan',
}

export default function DisclaimerPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">

          <h1 className="mb-2 text-3xl font-bold font-display text-green">Disclaimer</h1>
          <div className="w-12 h-[3px] bg-gold rounded mb-8" />

          <div className="space-y-5 text-sm leading-relaxed text-ink-mid font-body">
            <p>
              Pride of Pakistan website is for information and social entertainment purposes only. Content posted on
              this site may contain errors or inaccuracies, as it is based on gossip, news, rumours and personal
              opinions.
            </p>
            <p>
              We do not endorse the quality of any services, products, information or materials displayed, purchased,
              or obtained by you as a result of an advertisement or any other information on the Pride of Pakistan
              website. The Pride of Pakistan website reserves the right, without any obligation whatsoever to make
              improvements, to remove any listing / material or correct any error or omissions in any part of the
              website.
            </p>
            <p>
              All images, videos, news and articles that appear on this website are copyright to their respective
              owners. If you own the rights to any of the images, videos, news, articles or any other material and do
              not wish them to appear on this site, please do not hesitate to contact{' '}
              <a href="mailto:info@prideofpakistan.com" className="text-gold hover:underline">
                info@prideofpakistan.com
              </a>{' '}
              for immediate removal.
            </p>
            <p>
              Pride of Pakistan website may contain links to other websites and the owner assumes no responsibility
              for the content of such websites. The owner of Pride of Pakistan website is not responsible for the
              accuracy, copyright compliance, legality or decency of material posted in any section of this site.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}