'use client';
import UserLayout from "@/components/CombinedNavbar"
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import TwoFATabs from '@/components/TwoFATab'

const tabs = ['Profile', 'Subscription', 'Billing History', '2FA Settings'];

export default function AccountSettings(props) {
  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

        {/* Tab Content */}
        <div className="bg-white border rounded shadow p-6">
          {activeTab === 'Profile' && <ProfileTab />}
          {activeTab === 'Subscription' && <SubscriptionTab />}
          {activeTab === 'Billing History' && <BillingTab />}
          {activeTab === '2FA Settings' && <TwoFATab />}
        </div>
      </div>
    </UserLayout>
  );
}

// 🔹 Placeholder components (to be implemented step-by-step)
function ProfileTab() {
    const { data: session, update } = useSession();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (session?.user?.name) {
        setName(session.user.name);
      }
    }, [session]);
  
    const handleSubmit = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/account/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
  
        if (res.ok) {
          await update(); // Refresh session
          toast.success('Profile updated!');
        } else {
          toast.error('Failed to update profile');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error updating profile');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={session?.user?.email || ''}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </div>
    );
  }

  function SubscriptionTab() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch('/api/user/account/subscription')
        .then((res) => res.json())
        .then(setSubscription)
        .catch((err) => console.error('Error loading subscription:', err))
        .finally(() => setLoading(false));
    }, []);
  
    const openStripePortal = async () => {
      const res = await fetch('/api/user/account/manage-subscription', { method: 'POST' });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    };
  
    if (loading) return <p>Loading...</p>;
    if (!subscription) return <p>No subscription found.</p>;
  
    return (
      <div className="space-y-4 max-w-md">
        <div>
          <p><strong>Plan:</strong> {subscription.plan}</p>
          <p><strong>Status:</strong> {subscription.status}</p>
          <p><strong>Credits:</strong> {subscription.credits}</p>
          <p><strong>Expires:</strong> {new Date(subscription.expiresAt).toLocaleDateString()}</p>
        </div>
  
        <button
          onClick={openStripePortal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Manage Subscription
        </button>
      </div>
    );
  }

  function BillingTab() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/account/transactions')
      .then((res) => res.json())
      .then(setTransactions)
      .catch((err) => console.error('Error loading transactions:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading billing history...</p>;
  if (!transactions.length) return <p>No billing records found.</p>;

  const formatPKR = (value: number) => `PKR ${value.toLocaleString()}`;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Billing History</h2>
      <table className="min-w-full border rounded text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Amount</th>
            <th className="p-3">Type</th>
            <th className="p-3">Status</th>
            <th className="p-3">Reference</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="border-t">
              <td className="p-3">{formatPKR(txn.amount)}</td>
              <td className="p-3">{txn.type.replace('_', ' ')}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    txn.status === 'SUCCESS'
                      ? 'bg-green-100 text-green-700'
                      : txn.status === 'REFUNDED'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {txn.status}
                </span>
              </td>
              <td className="p-3 text-xs text-gray-500">{txn.reference || '-'}</td>
              <td className="p-3 text-xs text-gray-500">
                {new Date(txn.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TwoFATab() {
  return <p>Enable/disable Google 2FA here.
    <TwoFATabs />
  </p>;
}
