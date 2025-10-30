// pages/pricing.tsx
import Head from 'next/head';
import SampleLeadCard from '@/components/landing/SameLeadCard';
import { useState } from 'react';
import Header from '@/components/landing/Header';
import { useRouter } from 'next/router';

type PlanKey = 'STARTER' | 'GROWTH' | 'PRO';

export default function PricingPage(props) {
  const [annual, setAnnual] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const router = useRouter();

  // Plans aligned to backend (keys must match server expectations)
  const plans: Array<{
    name: string;
    key: PlanKey;
    monthly: number;
    description: string;
    features: string[];
    highlight?: boolean;
  }> = [
    {
      name: 'Starter',
      key: 'STARTER',
      monthly: 49,
      description: 'Access the lead marketplace and pay full price per lead.',
      features: [
        'Standard marketplace access',
        'Pay full price per lead',
        'Basic filters (location, property type)',
        'Email lead alerts',
        'No free leads (pay-per-lead)',
        'Solo-friendly setup',
      ],
    },
    {
      name: 'Growth',
      key: 'GROWTH',
      monthly: 129,
      description: 'Priority access + 10% off all lead purchases & CSV Export.',
      highlight: true, // visually emphasize mid plan
      features: [
        '10% discount on all leads',
        'Priority access (~2 hours earlier)',
        'Enhanced filters (budget, buyer/seller, intent)',
        'AI smart recommendations',
        'Email & chat support',
        'CSV & Google Sheets export',
        'Monthly insights snapshot',
        'CRM-ready data',
        'Standard marketplace access',
        'Pay full price per lead',
        'Basic filters (location, property type)',
        'Email lead alerts',
        'No free leads (pay-per-lead)',
        'Solo-friendly setup',
      ],
    },
    {
      name: 'Pro',
      key: 'PRO',
      monthly: 299,
      description: 'Early access + 20% off, advanced scoring & CRM integrations.',
      features: [
        '20% discount on all leads',
        'Early access (~24 hours earlier)',
        'Advanced lead scoring & insights',
        'CRM integrations (Zoho, HubSpot, Salesforce)',
        'Pipeline management dashboard',
        'Team collaboration ready',
        'Quarterly strategy touchpoint',
        'Premium support routing',
        'Standard marketplace access',
        'Pay full price per lead',
        'Basic filters (location, property type)',
        'Email lead alerts',
        'No free leads (pay-per-lead)',
        'Solo-friendly setup',
        '10% discount on all leads',
        'Priority access (~30 mins earlier)',
        'Enhanced filters (budget, buyer/seller, intent)',
        'AI smart recommendations',
        'Email & chat support',
        'CSV & Google Sheets export',
        'Monthly insights snapshot',
        'CRM-ready data',
      ],
    },
  ];

  const calculateMonthlyPrice = (monthly: number) =>
    annual ? (monthly * 0.8).toFixed(2) : monthly;
  const calculateAnnualPrice = (monthly: number) =>
    (monthly * 12 * 0.8).toFixed(0);

  const allFeatures = [...new Set(plans.flatMap((p) => p.features))];

  const competitors = [
    ['Verified Leads Only', '✔️', '✔️', '➖', '✔️'],
    ['Subscription Available', '✔️', '✖️', '✔️', '✖️'],
    ['Lead Preview', '✔️', '✔️', '✖️', '✖️'],
    ['Refunds for Bad Leads', '✔️', '✔️', '➖', '✔️'],
    ['Exclusive Leads', '✔️', '✔️', '✖️', '✔️'],
    ['Lead Management Dashboard', '✔️', '✖️', 'Limited', '✖️'],
    ['Auto-Tagging & CRM Integration', '✔️', '✖️', '➖', '✖️'],
    ['Support Speed', 'Live chat / 24hr', 'Email / 2–3 days', 'Phone/Email', 'Email only'],
  ];

  // Kick off Stripe Checkout (uses your existing API)
  const startCheckout = async (planKey: PlanKey) => {
    try {
      setLoadingPlan(planKey);
      const resp = await fetch('/api/stripe/create-subscription-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planKey, annual }),
      });

      if (resp.status === 401) {
        // not signed in → send to login then back here
        const cb = encodeURIComponent('/pricing');
        router.push(`/auth/login?callbackUrl=${cb}`);
        return;
      }

      const data = await resp.json();
      if (!resp.ok || !data?.url) throw new Error(data?.error || 'Failed to start checkout');
      window.location.href = data.url; // Stripe Hosted Checkout
    } catch (e: any) {
      alert(e.message || 'Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Header />
      <Head>
        <title>Subscription Plans | ZestLeads</title>
      </Head>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4
                       [font-family:'Plus_Jakarta_Sans']
                       bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
                       bg-clip-text text-transparent"
          >
            Choose Your Plan
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Subscribe for access, priority, and tools—then buy verified leads on demand.
            No free leads; pay-per-lead with plan-based discounts. Save 20% with annual billing.
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <span className="text-sm text-gray-600">Billed Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={annual}
                onChange={() => setAnnual((v) => !v)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none
                              after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                              after:bg-white after:border after:rounded-full after:h-5 after:w-5
                              after:transition-all peer-checked:after:translate-x-full
                              peer-checked:bg-[#0A7894] relative"></div>
            </label>
            <span className="text-sm text-green-600 font-medium">Save 20%</span>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const expanded = expandedPlans[plan.name];
            const displayFeatures = expanded ? plan.features : plan.features.slice(0, 6);
            const isLoading = loadingPlan === plan.key;

            return (
              <div
                key={plan.name}
                className={`rounded-2xl border shadow-sm p-6 transition
                            bg-white/90 ${plan.highlight ? 'ring-2 ring-[#0A7894]' : 'border-[#DDE3EA]'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold">{plan.name}</h2>
                  {plan.highlight && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#0A7894]/10 text-[#0A7894]">
                      Most Popular
                    </span>
                  )}
                </div>

                <p className="text-gray-500 mb-4">{plan.description}</p>

                <div className="text-3xl font-bold mb-2">
                  <span className="bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
                                   bg-clip-text text-transparent">
                    ${calculateMonthlyPrice(plan.monthly)}
                  </span>
                  <span className="text-base font-medium text-gray-500"> /month</span>
                </div>

                {annual && (
                  <p className="text-sm text-gray-500 mb-4">
                    Billed annually at ${calculateAnnualPrice(plan.monthly)}
                  </p>
                )}

                <ul className="text-sm text-gray-700 space-y-2 mb-5">
                  {displayFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#82E15A]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.features.length > 6 && (
                  <button
                    className="text-sm text-[#0A7894] underline mb-4"
                    onClick={() =>
                      setExpandedPlans((prev) => ({ ...prev, [plan.name]: !expanded }))
                    }
                  >
                    {expanded ? 'View Less' : 'View More'}
                  </button>
                )}

                <button
                  onClick={() => startCheckout(plan.key)}
                  disabled={isLoading}
                  className={`w-full rounded-lg py-2.5 text-white transition
                    ${isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#82E15A] to-[#0A7894] hover:brightness-105'}`}
                >
                  {isLoading ? 'Redirecting…' : 'Choose Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Subscription Comparison */}
        <div className="mt-24">
          <h2
            className="text-3xl font-bold text-center mb-6
                       [font-family:'Plus_Jakarta_Sans']
                       bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
                       bg-clip-text text-transparent"
          >
            Compare Plans
          </h2>
          <section className="py-10 border-t border-[#E6EAF0]">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border border-gray-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3">Features</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="px-4 py-3 text-center">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2 font-medium">{feature}</td>
                      {plans.map((plan) => (
                        <td key={plan.name} className="px-4 py-2 text-center">
                          {plan.features.includes(feature) ? '✔️' : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Competitor Comparison */}
        <div className="mt-24">
          <h2
            className="text-3xl font-bold text-center mb-6
                       [font-family:'Plus_Jakarta_Sans']
                       bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
                       bg-clip-text text-transparent"
          >
            How We Compare With Others
          </h2>
          <section className="py-10 border-t border-[#E6EAF0]">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border border-gray-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3">Feature</th>
                    <th className="px-4 py-3">ZestLeads</th>
                    <th className="px-4 py-3">iSpeedToLead</th>
                    <th className="px-4 py-3">zBuyer</th>
                    <th className="px-4 py-3">PropertyLeads</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map(([feature, zest, speed, zbuyer, pl], idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2 font-medium">{feature}</td>
                      <td className="px-4 py-2 text-center">{zest}</td>
                      <td className="px-4 py-2 text-center">{speed}</td>
                      <td className="px-4 py-2 text-center">{zbuyer}</td>
                      <td className="px-4 py-2 text-center">{pl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sample Lead */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-4">See What a Verified Lead Looks Like?</h2>
          <SampleLeadCard />
        </div>
      </div>
    </>
  );
}
