// pages/api/user/account/upgrade-subscription.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Match to tiers used in webhook
const PLAN_PRICES: Record<string, { priceId: string; tierName: string }> = {
  'Starter Agent': {
    priceId: process.env.STRIPE_PRICE_STARTER!,
    tierName: 'Starter Agent',
  },
  'Growth Broker': {
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    tierName: 'Growth Broker',
  },
  'PRO Team': {
    priceId: process.env.STRIPE_PRICE_PRO!,
    tierName: 'PRO Team',
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { plan } = req.body;
  const selected = PLAN_PRICES[plan];

  if (!selected) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    let stripeCustomerId = user?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: user?.name ?? undefined,
      });

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customer.id },
      });

      stripeCustomerId = customer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price: selected.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        planName: selected.tierName, // used by webhook.ts
      },
      success_url: `${req.headers.origin}/user/subscription?success=1`,
      cancel_url: `${req.headers.origin}/user/subscription?canceled=1`,
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('🔴 Stripe subscription error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
