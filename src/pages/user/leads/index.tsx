'use client';
import UserLayout from '@/layouts/UserLayout';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import StripeCheckoutButton from '@/components/StripeCheckoutButton';


type Lead = {
  id: string;
  name: string;
  propertyType: string;
  desireArea: string;
  priceRange: string;
  price: number | null;
  leadType: 'BUYER' | 'SELLER';
  createdAt: string;
};

export default function UserLeadsPage(props) {
  const { data: session } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState<'BUYER' | 'SELLER'>('BUYER');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/user/leads');
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error('Failed to load leads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handlePurchase = async () => {
    if (!selectedLead || !session?.user?.id) return;
    setIsPurchasing(true);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          userId: session.user.id,
          referralCode: referralCode || null,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setIsPurchasing(false);
    }
  };

  const filteredLeads = leads.filter((lead) => lead.leadType === activeTab);

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Leads Marketplace</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-2">
          {['BUYER', 'SELLER'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'BUYER' | 'SELLER')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-600">Loading leads...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-gray-600">No leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded shadow-sm">
              <thead className="bg-gray-100 text-left text-sm text-gray-600">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price Range</th>
                  <th className="p-3">Admin Price</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t text-sm">
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.desireArea}</td>
                    <td className="p-3">{lead.propertyType}</td>
                    <td className="p-3">{lead.priceRange}</td>
                    <td className="p-3">{lead.price ? `PKR ${lead.price.toLocaleString()}` : '-'}</td>
                    <td className="p-3 text-center">
                    <StripeCheckoutButton
                        lead={{
                        id: lead.id,
                        name: lead.name,
                        price: lead.price || 0,
                        propertyType: lead.propertyType,
                        }}
                        userId={session?.user?.id}
                    />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-2 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-3">Lead Details</h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Name:</strong> {selectedLead.name}</p>
              <p><strong>Area:</strong> {selectedLead.desireArea}</p>
              <p><strong>Type:</strong> {selectedLead.propertyType}</p>
              <p><strong>Lead Type:</strong> {selectedLead.leadType}</p>
              <p><strong>Price Range:</strong> {selectedLead.priceRange}</p>
              {selectedLead.price && (
                <p><strong>Admin Price:</strong> PKR {selectedLead.price.toLocaleString()}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">Referral Code (optional)</label>
              <input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                placeholder="Enter referral code if any"
              />
            </div>

            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="mt-5 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 w-full"
            >
              {isPurchasing ? 'Redirecting to Checkout...' : 'Buy Lead via Stripe'}
            </button>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
