'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartCheckoutButton({
  cartItems,
  referralCode,
  discountPercent = 0,
  onSuccess,
  className = '',
}: {
  cartItems: { id: string; lead: { id: string; name: string; price: number; propertyType: string } }[];
  referralCode?: string;
  discountPercent?: number;
  onSuccess: () => void;
  className?: string;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const [loading, setLoading] = useState(false);

  // ✅ Match backend logic: apply discount to first item only
  const total = cartItems.reduce((sum, item, idx) => {
    const price = item.lead.price || 0;
    const isDiscounted = referralCode && discountPercent > 0 && idx === 0;
    const discount = isDiscounted ? price * (discountPercent / 100) : 0;
    return sum + (price - discount);
  }, 0);

  const handleCheckout = async () => {
    if (!session?.user) {
      toast.error('You need to be logged in to checkout.');
      return signIn(undefined, { callbackUrl: '/cart' });
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: cartItems.map((it) => it.lead.id),
          userId,
          referralCode,
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
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`inline-flex items-center justify-center text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full font-medium transition ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? 'Redirecting…' : `Confirm Order – $${total.toFixed(2)}`}
    </button>
  );
}
