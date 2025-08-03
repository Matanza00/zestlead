// pages/pricing.tsx
import Head from 'next/head';
import SampleLeadCard from '@/components/landing/SameLeadCard';
import { useState } from 'react';
import Header from '@/components/landing/Header';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<{ [key: string]: boolean }>({});
  const plans = [
    {
      name: 'Starter Agent',
      monthly: 49,
      description: 'Perfect for solo agents testing verified leads.',
      features: [
        'Verified Seller & Buyer Leads',
        'Location-based Lead Filters',
        'A La Carte Lead Purchase',
        'Basic Performance Analytics',
        'Lead Quality Guarantee',
        'Email & Chat Support'
      ],
    },
    {
      name: 'Growth Broker',
      monthly: 109,
      description: 'For agents scaling their pipeline with tools & discounts.',
      features: [
        'Verified Seller & Buyer Leads',
        '20% Off Lead Purchases',
        'CSV & Google Sheets Export',
        'Email & Chat Support',
        'Access to Premium, High-Motivation Leads',
        'Location-based Lead Filters',
        'A La Carte Lead Purchase',
        'Basic Performance Analytics',
        'Lead Quality Guarantee',     
        'Priority Lead Delivery',
        'Auto-Tagging + Contact Logs',
        'CRM Integration',     
        'Monthly Insights Report'
      ],
    },
    {
      name: 'Enterprise Team',
      monthly: 499,
      description: 'Built for brokerages managing teams and high volume.',
      features: [
        'Verified Seller & Buyer Leads',
        'Bulk Lead Discounts (up to 35%)',
        'Monthly Insights Report',
        'Unlimited Team Members',  
        'Lead Assignment & Visibility Tools',
        'Priority Lead Delivery',
        'Location-based Lead Filters',
        'A La Carte Lead Purchase',
        'Basic Performance Analytics',
        'Lead Quality Guarantee',
        'Email & Chat Support',
        'Access to Premium, High-Motivation Leads',
        '20% Off Lead Purchases',
        'Auto-Tagging + Contact Logs',
        'CRM Integration',
        'CSV & Google Sheets Export',
        'Dedicated Account Manager',
        'Quarterly Strategy Call',
        'Premium Support SLA'
      ],
    }
  ];

  const calculateMonthlyPrice = (monthly: number) => {
    return annual ? (monthly * 0.8).toFixed(2) : monthly;
  };

  const calculateAnnualPrice = (monthly: number) => {
    return (monthly * 12 * 0.8).toFixed(0);
  };

    const allFeatures = [
    ...new Set(plans.flatMap(plan => plan.features))
  ];


  const competitors = [
    ['Verified Leads Only', '✔️', '✔️', '➖', '✔️'],
    ['Subscription Available', '✔️', '✖️', '✔️', '✖️'],
    ['Lead Preview', '✔️', '✔️', '✖️', '✖️'],
    ['Refunds for Bad Leads', '✔️', '✔️', '➖', '✔️'],
    ['Exclusive Leads', '✔️', '✔️', '✖️', '✔️'],
    ['Lead Management Dashboard', '✔️', '✖️', 'Limited', '✖️'],
    ['Auto-Tagging & CRM Integration', '✔️', '✖️', '➖', '✖️'],
    ['Support Speed', 'Live chat / 24hr', 'Email / 2–3 days', 'Phone/Email', 'Email only']
  ];

  return (
    <>
    <Header />
      <Head>
        <title>Subscription Plans | ZestLead</title>
      </Head>

       <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Flexible pricing for solo agents, brokers, and real estate teams. Pay only for what you need — save 20% with annual billing.</p>

          <div className="mt-6 flex justify-center items-center gap-4">
            <span className="text-sm text-gray-600">Billed Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={annual} onChange={() => setAnnual(!annual)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
            <span className="text-sm text-green-600 font-medium">Save 20%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const expanded = expandedPlans[plan.name];
            const displayFeatures = expanded ? plan.features : plan.features.slice(0, 6);
            return (
              <div key={plan.name} className="border rounded-lg p-6 shadow">
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-gray-500 mb-4">{plan.description}</p>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${calculateMonthlyPrice(plan.monthly)}<span className="text-base font-medium text-gray-500"> /month</span>
                </div>
                {annual && (
                  <p className="text-sm text-gray-500 mb-4">Billed annually at ${calculateAnnualPrice(plan.monthly)}</p>
                )}
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  {displayFeatures.map((feature, idx) => (
                    <li key={idx}>✔️ {feature}</li>
                  ))}
                </ul>
                {/* {plan.features.length > 6 && (
                  <button
                    className="text-sm text-blue-600 underline mb-4"
                    onClick={() => setExpandedPlans((prev) => ({ ...prev, [plan.name]: !expanded }))}
                  >
                    {expanded ? 'View Less' : 'View More'}
                  </button>
                )} */}
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Choose Plan</button>
              </div>
            );
          })}
        </div>

        
         {/* Subscription Comparison Section */} 
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-6">Compare Plans</h2>
          <section className="py-16 bg-background border-t border-border">
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
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
                    {plans.map(plan => (
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
        
        {/* Competitor Comparison Section */}
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-6">How We Compare With Others</h2>
          <section className="py-16 bg-background border-t border-border">
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">ZestLead</th>
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
        
        {/* Sample Lead Card Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-4">See What a Verified Lead Looks Like ?</h2>
          <SampleLeadCard />
        </div>
      </div>
    </>
  );
}
