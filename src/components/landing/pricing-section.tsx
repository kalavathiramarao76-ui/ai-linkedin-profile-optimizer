import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try it out with basic features',
    features: ['3 profile analyses per month', 'Basic score dashboard', '5 headline generations', 'Community support'],
    cta: 'Get Started',
    href: '/app/analyze',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For active job seekers',
    features: [
      'Unlimited analyses',
      'Full score dashboard with radar chart',
      'Unlimited headline generation',
      'Summary writer (all tones)',
      'Keyword optimizer',
      'AI rewriter for all sections',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    href: '/pricing',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: 'per month',
    description: 'For teams and career coaches',
    features: [
      'Everything in Pro',
      'Team management dashboard',
      'Bulk profile analysis',
      'API access',
      'Custom branding',
      'Dedicated account manager',
      'SSO & advanced security',
    ],
    cta: 'Contact Sales',
    href: '/pricing',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Start free, upgrade when you are ready. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.popular
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-xl shadow-indigo-500/10'
                  : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
