import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { PricingSection } from '@/components/landing/pricing-section';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 text-lg">Three simple steps to a standout profile</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Paste Your Profile', desc: 'Copy your LinkedIn profile text or URL and paste it into the analyzer.' },
              { step: '02', title: 'Get AI Analysis', desc: 'Our AI scores every section and identifies exactly what to improve.' },
              { step: '03', title: 'Apply & Shine', desc: 'Copy the optimized content directly to your LinkedIn profile and watch results.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'How does the AI analyze my profile?', a: 'We use advanced language models to evaluate your profile across key dimensions that recruiters and hiring managers look for: headline strength, summary effectiveness, experience descriptions, skill relevance, and keyword optimization.' },
              { q: 'Is my data safe?', a: 'Absolutely. We do not store your LinkedIn credentials. You simply paste your profile text, and it is processed securely through our AI pipeline. We never share your data with third parties.' },
              { q: 'Do I need to connect my LinkedIn account?', a: 'No. You simply copy and paste your profile text. This is safer and faster than any OAuth-based approach.' },
              { q: 'How accurate is the scoring?', a: 'Our scoring model is calibrated against thousands of successful profiles from top professionals. While no AI is perfect, our recommendations consistently lead to measurable improvements in profile views and recruiter outreach.' },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-base font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your LinkedIn?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join thousands of professionals who have optimized their profiles with AI.
          </p>
          <a
            href="/app/analyze"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25"
          >
            Start Optimizing — Free
          </a>
        </div>
      </section>

      <PricingSection />
      <Footer />
    </div>
  );
}
