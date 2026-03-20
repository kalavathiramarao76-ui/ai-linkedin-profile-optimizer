import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { PricingSection } from '@/components/landing/pricing-section';

export const metadata = {
  title: 'Pricing - ProfileAI',
  description: 'Simple, transparent pricing for LinkedIn profile optimization. Start free, upgrade when ready.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <PricingSection />
      </div>

      {/* FAQ section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Pricing FAQ</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your access continues until the end of the billing period.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express) via our secure Stripe payment processing.' },
              { q: 'Is there a free trial for Pro?', a: 'Yes! Pro comes with a 7-day free trial. No credit card required to start.' },
              { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee if you are not satisfied with the Pro plan.' },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <h3 className="text-base font-semibold text-white mb-1">{item.q}</h3>
                <p className="text-sm text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
