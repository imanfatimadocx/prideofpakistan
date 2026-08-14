import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export const metadata = {
  title: 'Terms of Use | Pride of Pakistan',
}

export default function TermsOfUsePage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">

          <h1 className="mb-2 text-3xl font-bold font-display text-green">Terms of Use</h1>
          <div className="w-12 h-[3px] bg-gold rounded mb-8" />

          <div className="text-sm leading-relaxed space-y-7 text-ink-mid font-body">

            <div>
              <h2 className="mb-2 text-base font-bold font-display text-green">
                1. Agreement between you and Pride of Pakistan
              </h2>
              <p>
                This is an Agreement between you and Pride of Pakistan website. Your use of the Pride of Pakistan
                website constitutes your acceptance of this Agreement and any information that you submit is correct.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-bold font-display text-green">
                2. Pride of Pakistan may modify this Agreement
              </h2>
              <p>
                Pride of Pakistan reserves the right to change the terms and conditions under which it offers the
                Pride of Pakistan website.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-bold font-display text-green">
                3. No unlawful use of the Pride of Pakistan website
              </h2>
              <p>
                You may not use the Pride of Pakistan website in any way that breaches any code of conduct or policy
                applicable to the Pride of Pakistan website. You may not use the Pride of Pakistan website in any
                manner that could damage, disable, overburden, or impair Pride of Pakistan web site or interfere with
                any other party's use of the Pride of Pakistan website.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-bold font-display text-green">
                4. Materials you post or provide
              </h2>
              <p>
                Any material you post or provide for Pride of Pakistan website, you grant permission to use, copy,
                edit, modify, translate and reformat your submission. Pride of Pakistan will not pay you for your
                submission and may remove your submission at any time.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-bold font-display text-green">
                5. Copyright and trademark notices
              </h2>
              <p>
                All contents of the Pride of Pakistan website are Copyright. The names of actual companies and
                products mentioned herein may be the trademarks of their respective owners.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-bold font-display text-green">
                6. Other Acknowledgements
              </h2>
              <p>
                Pride of Pakistan may change or delete features in any way, at any time and for any reason. Pride of
                Pakistan will not guarantee that it will be error free and will not be liable for any omissions,
                inaccuracies, deletion, negligence, computer virus, delay or interruption in the transmission to the
                users or under any other cause of action.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}