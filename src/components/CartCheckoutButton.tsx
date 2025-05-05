// components/CartCheckoutButton.tsx
'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartCheckoutButton({
  cartItems,
  onSuccess,
}: {
  cartItems: { id: string; lead: { id: string; name: string; price: number; propertyType: string } }[];
  onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, it) => sum + it.lead.price, 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: cartItems.map((it) => it.lead.id),
          userId,
          referralCode: referralCode || undefined,
        }),
      });
      const { id: sessionId, error } = await res.json();
      if (error) throw new Error(error);
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Referral / Discount Code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          disabled={loading}
        />
      </div>
      <div className="flex justify-between mb-4">
        <span>Total:</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Redirecting…' : `Pay $${total.toFixed(2)}`}
      </button>
    </div>
  );
}
