'use client';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeCheckoutButton({
  lead,
  userId
}: {
  lead: { id: string; name: string; price: number; propertyType: string };
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allDiscounts, setAllDiscounts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/discounts")
      .then(res => res.json())
      .then(setAllDiscounts)
      .catch(console.error);
  }, []);

  const getDiscountPercent = () => {
    const match = allDiscounts.find(d => d.code.toLowerCase() === referralCode.toLowerCase());
    return match?.percentage || 0;
  };

  const calculateFinalPrice = () => {
    const percent = getDiscountPercent();
    return percent ? lead.price - (lead.price * (percent / 100)) : lead.price;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          userId,
          referralCode
        }),
      });

      const data = await res.json();
      if (data?.id) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.id });
      } else {
        setError(data?.error || 'Failed to create checkout session.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
      >
        Buy This Lead
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Confirm Purchase</h2>

            <p className="mb-2 text-sm text-gray-700">
              <strong>Lead:</strong> {lead.name} <br />
              <strong>Property Type:</strong> {lead.propertyType} <br />
              <strong>Price:</strong> ${calculateFinalPrice().toFixed(2)}{' '}
              {getDiscountPercent() > 0 && (
                <span className="text-green-600 text-xs">
                  (after {getDiscountPercent()}% off with {referralCode})
                </span>
              )}
            </p>

            <input
              type="text"
              placeholder="Referral / Discount Code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="border w-full px-3 py-2 rounded mb-3 text-sm"
              disabled={loading}
            />

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {loading ? 'Redirecting...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
