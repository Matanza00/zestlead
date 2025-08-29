// pages/subscription/index.tsx
'use client';

import PricingSection from '@/components/PricingSection';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function SubscriptionPage(props) {
  const router = useRouter();
  const { leadId } = router.query;
  const parsedLeadId = Array.isArray(leadId) ? leadId[0] : leadId;
  const { status, data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // If not logged in, immediately send to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/auth/login?callbackUrl=/subscription?leadId=${parsedLeadId}`);
    }
  }, [status, parsedLeadId, router]);

  // Check subscription status
  useEffect(() => {
    if (status !== 'authenticated') return;
    (async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
        setLoading(false);
        // if already subscribed, go into cart
        if (data.isSubscribed && parsedLeadId) {
          router.replace(`/cart?leadId=${parsedLeadId}`);
        }
      } catch {
        toast.error('Failed to check subscription status');
        setLoading(false);
      }
    })();
  }, [status, parsedLeadId, router]);

  const handleSelectPlan = async (planKey: 'STARTER' | 'GROWTH' | 'PRO') => {
    if (!parsedLeadId) {
      toast.error('Missing lead ID');
      return;
    }
    try {
      const res = await fetch('/api/stripe/create-subscription-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, leadId: parsedLeadId })
      });
      const { url, error } = await res.json();
      if (error || !url) throw new Error(error || 'Subscription session failed');
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Subscription failed');
    }
  };

  if (loading || status === 'loading') {
    return <div className="p-10 text-center">Checking subscription…</div>;
  }

  return (
    <PricingSection
      subscribed={isSubscribed}
      onSelectPlan={handleSelectPlan}
    />
  );
}
