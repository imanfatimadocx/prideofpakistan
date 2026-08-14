import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const metadata = {
  title: 'Privacy Policy | Pride of Pakistan',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">

          <h1 className="mb-2 text-3xl font-bold font-display text-green">Privacy Policy</h1>
          <div className="w-12 h-[3px] bg-gold rounded mb-8" />

          <div className="space-y-5 text-sm leading-relaxed text-ink-mid font-body">
            <p>
              Pride of Pakistan is committed to protecting your privacy and has developed this policy because we want
              you to feel confident about the privacy of your personal details.
            </p>
            <p>
              Pride of Pakistan is a general audience web site, intended for users of all ages and this Privacy Policy
              applies to data collection and usage on Pride of Pakistan web site.
            </p>
            <p>
              General information gathered from your given data is displayed on the Pride of Pakistan web site, but
              personal information, such as your date of birth, home or business address, telephone number and e-mail
              address will not be displayed, shared or disclosed to any other party unless we have your permission to
              do so.
            </p>
            <p>
              Pride of Pakistan does not sell, rent or lease its profile list to third parties, however Pride of
              Pakistan may, from time to time, contact you about a particular offering that may be of interest to you.
            </p>
            <p>
              Personal information collected on this site may be stored and processed in Pakistan or any other country
              for hosting purposes only and you consent to any such transfer of information, and retention of data.
            </p>
            <p>
              Pride of Pakistan will occasionally update this Privacy Policy with the passage of time and will not be
              obligatory to inform you about the updating in the policy.
            </p>
            <p>
              Pride of Pakistan welcomes your comments regarding this Privacy Policy. If you believe that Pride of
              Pakistan has not adhered to this policy, please contact Pride of Pakistan by{' '}
              <a href="mailto:info@prideofpakistan.com" className="text-gold hover:underline">
                info@prideofpakistan.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}