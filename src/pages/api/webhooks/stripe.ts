// pages/api/webhooks/stripe.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature']!;
  const rawBody = await buffer(req);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('❌ Webhook signature mismatch:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const sess = event.data.object as Stripe.Checkout.Session;

    // Subscription completed
    if (sess.mode === 'subscription') {
      const userId  = sess.metadata?.userId as string;
      const planKey = sess.metadata?.planName as string;
      const subId   = sess.subscription as string;

      const stripeSub = await stripe.subscriptions.retrieve(subId, {
        expand: ['items.data.price.product']
      });
      const tierName = stripeSub.items.data[0].price.product.name;
      const status   = stripeSub.status.toUpperCase() as 'ACTIVE'|'CANCELLED'|'EXPIRED';
      const started  = new Date(stripeSub.start_date * 1000);
      const expires  = new Date(stripeSub.current_period_end * 1000);

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan: planKey,
          status,
          startedAt:  started,
          expiresAt:  expires,
          stripeSubscriptionId: stripeSub.id,
          tierName
        },
        update: {
          status,
          expiresAt: expires
        }
      });
      console.log(`✅ Subscription upserted for ${userId}: ${tierName}`);
    }

    // Lead payment completed
    else if (sess.mode === 'payment') {
      const leadIdsRaw = sess.metadata?.leadIds as string | undefined;
      const userId     = sess.metadata?.userId as string;
      if (leadIdsRaw && userId) {
        const leadIds: string[] = JSON.parse(leadIdsRaw);
        for (const leadId of leadIds) {
          await prisma.leadPurchase.create({
            data: { userId, leadId }
          });
          console.log(`✅ Lead purchased for ${userId}: lead ${leadId}`);
        }
      }
    }
  }

  res.json({ received: true });
}
