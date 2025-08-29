// pages/api/stripe/create-subscription-session.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession }   from 'next-auth/next';
import { authOptions }        from '@/lib/auth';
import Stripe                 from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// A utility type for Stripe params
type SessionParams = Stripe.Checkout.SessionCreateParams;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // 1) Auth check
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2) Destructure + narrow plan & leadId
  const { plan: rawPlan, leadId: rawLeadId } = req.body as {
    plan?: unknown;
    leadId?: unknown;
  };

  const plan = typeof rawPlan === 'string'
    ? rawPlan.toUpperCase()
    : undefined;

  const leadId = typeof rawLeadId === 'string'
    ? rawLeadId
    : '';

  // 3) Map to your env price IDs
  const priceMap: Record<string,string> = {
    STARTER:    process.env.STRIPE_PRICE_STARTER!,
    GROWTH:     process.env.STRIPE_PRICE_GROWTH!,
    PRO: process.env.STRIPE_PRICE_PRO!,
  };

  if (!plan || !priceMap[plan]) {
    return res.status(400).json({ error: 'Invalid or missing plan' });
  }
  const priceId = priceMap[plan];

  // 4) Build your success/cancel URLs
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const successUrl = `${base}/cart?leadId=${encodeURIComponent(leadId)}`;
  const cancelUrl  = `${base}/subscription?leadId=${encodeURIComponent(leadId)}&canceled=true`;

  try {
    // 5) Create (or reuse) a Stripe customer
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId: session.user.id }
    });

    // 6) Create the checkout session
    const params: SessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: successUrl,
      cancel_url:  cancelUrl,
      metadata:    { 
        planName: plan,      // <— add this
        userId: session.user.id // Store user ID for later use
      }
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Stripe subscription session error:', err);
    return res.status(500).json({ error: err.message });
  }
}
