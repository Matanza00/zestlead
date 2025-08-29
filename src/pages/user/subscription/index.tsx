'use client';
import UserLayout from '@/components/CombinedNavbar';
import { useEffect, useState } from 'react';
import { BadgeCheck, CheckCircle2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';

export default function SubscriptionPage(props) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/user/account/subscription');
        const data = await res.json();
        setSubscription(data);

        if (router.query.success) {
          setShowSuccess(true);
          setTimeout(() => {
            router.replace('/user/subscription', undefined, { shallow: true });
          }, 3000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [router.query.success]);

  const handleUpgrade = async (plan: string) => {
    const res = await fetch('/api/user/account/upgrade-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };
  console.log(subscription);

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
      gradient: 'from-purple-500 to-fuchsia-500'
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
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      name: 'PRO Team',
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
      gradient: 'from-blue-600 to-indigo-700'
    }
  ];
  


  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BadgeCheck className="text-green-600" /> Subscription
        </h1>

        {showSuccess && (
          <div className="mb-4 px-4 py-2 bg-green-100 border border-green-300 text-green-800 rounded">
            <CheckCircle className="inline w-4 h-4 text-green-600 mr-1" /> Subscription upgraded successfully!
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : !subscription ? (
          <p>No subscription found.</p>
        ) : (
          <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl text-white p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-2">{subscription.tierName}</h2>
            <p className="mb-1">Renewing On <strong>{new Date(subscription.expiresAt).toLocaleDateString()}</strong></p>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <p>Remaining Leads</p>
                <p className="font-bold">4 out of 10</p>
              </div>
              <div>
                <p>Remaining Credits</p>
                <p className="font-bold">{subscription.credits} credits</p>
              </div>
              <div>
                <p>Discounts Availed</p>
                <p className="font-bold">2 out of 4</p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upgrade Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${plan.gradient} text-white rounded-xl p-6 flex flex-col justify-between`}
            >
              <div>
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="mb-2">${plan.monthly}/month</p>
                <p className="mb-4 text-sm text-white/80">{plan.description}</p>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleUpgrade(plan.name)}
                className="mt-6 bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200"
              >
                Upgrade
              </button>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
