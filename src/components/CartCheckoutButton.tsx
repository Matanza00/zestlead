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
  discountMaxCap = null,      // ← new prop
  onSuccess,
  className = '',
}: {
  cartItems: {
    id: string;
    lead: { id: string; name: string; price: number; propertyType: string };
  }[];
  referralCode?: string;
  discountPercent?: number;
  discountMaxCap?: number | null;  // ← new prop type
  onSuccess: () => void;
  className?: string;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const [loading, setLoading] = useState(false);

  // compute total including maxCap
  const total = cartItems.reduce((sum, item, idx) => {
    const price = item.lead.price || 0;
    let discount = 0;

    if (referralCode && discountPercent > 0 && idx === 0) {
      const raw = price * (discountPercent / 100);
      discount =
        discountMaxCap != null
          ? Math.min(raw, discountMaxCap)
          : raw;
    }

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

      // New: friendly handling of buy-delay rejections
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        const blocked = (data?.blocked || []) as Array<{
          id: string; name?: string; eligibleAt: string; waitMinutes: number;
        }>;
        if (blocked.length) {
          blocked.forEach(b => {
            const item = cartItems.find(ci => ci.lead.id === b.id);
            const name = item?.lead?.name || b.name || b.id;
            const when = new Date(b.eligibleAt);
            const timeStr = when.toLocaleString();
            toast.error(`${name} is eligible to buy at ${timeStr}`);
          });
        } else {
          toast.error(data?.message || 'Some leads are not eligible to buy yet.');
        }
        setLoading(false);
        return;
      }

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
      className={`
        inline-flex items-center justify-center text-white bg-green-600 hover:bg-green-700
        px-6 py-2 rounded-full font-medium transition
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading
        ? 'Redirecting…'
        : `Confirm Order – $${total.toFixed(2)}`}
    </button>
  );
}
