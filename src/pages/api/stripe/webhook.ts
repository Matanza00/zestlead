// pages/api/stripe/webhook.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
} as any);

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    if (!sig) return res.status(400).send('Missing Stripe signature');
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('❌ Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    const meta = sessionObj.metadata ?? {};
    const userId = meta.userId as string | undefined;
    const stripeSubId = sessionObj.subscription as string | undefined;
    const tierName   = meta.planName as string | undefined;
    const discountUsedId = meta.discountUsedId as string | undefined;

    // ── 1) LEAD PURCHASE FLOW ─────────────────────────────────────────────
    if (sessionObj.mode === 'payment' && (meta.leadIds || meta.leadId)) {
      // parse lead IDs
      let leadIds: string[] = [];
      if (meta.leadIds) {
        try { leadIds = JSON.parse(meta.leadIds as string); }
        catch { console.warn('Invalid leadIds JSON:', meta.leadIds); }
      } else if (meta.leadId) {
        leadIds = [meta.leadId as string];
      }

      // parse any assigned discount IDs
      let assignmentIds: string[] = [];
      if (meta.assignmentIds) {
        try { assignmentIds = JSON.parse(meta.assignmentIds as string); }
        catch { console.warn('Invalid assignmentIds JSON:', meta.assignmentIds); }
      }

      if (!userId || leadIds.length === 0) {
        console.error('❌ Missing userId or leadIds in metadata', meta);
        return res.status(400).json({ error: 'Missing userId or leadIds' });
      }

      try {
        for (const leadId of leadIds) {
          const lead = await prisma.lead.findUnique({ where: { id: leadId } });
          if (!lead) continue;

          // upsert the purchase record
          await prisma.leadPurchase.upsert({
            where: { userId_leadId: { userId, leadId } },
            update: { status: 'NOT_CONTACTED' },
            create: {
              userId,
              leadId,
              status: 'NOT_CONTACTED',
              ...(discountUsedId ? { discountUsedId } : {})
            }
          });

          // mark lead unavailable
          await prisma.lead.update({
            where: { id: leadId },
            data: { isAvailable: false }
          });

          // record transaction
          await prisma.transaction.create({
            data: {
              userId,
              amount: lead.price || 0,
              type: 'LEAD_PURCHASE',
              status: 'SUCCESS',
              reference: sessionObj.id,
            }
          });

          // remove from cart
          await prisma.cartItem.deleteMany({ where: { userId, leadId } });

          // send in-app notification
          const { createNotification } = await import('@/lib/notify');
          await createNotification({
            userId,
            type: 'PAYMENT',
            title: 'Payment Successful',
            message: `Your payment of PKR ${lead.price?.toLocaleString()} for lead "${lead.name}" was successful.`,
          });
        }

        // mark any used discount assignments
        if (assignmentIds.length > 0) {
          await prisma.discountAssignment.updateMany({
            where: { id: { in: assignmentIds } },
            data: { used: true },
          });
        }

        // handle Stripe promotion codes applied
        const promoCodeId = sessionObj.total_details?.breakdown?.discounts?.[0]?.promotion_code as string | undefined;
        if (promoCodeId) {
          const promo = await stripe.promotionCodes.retrieve(promoCodeId);
          const matched = await prisma.discount.findFirst({
            where: { stripePromotionId: promo.id },
            include: { assignedUsers: true },
          });
          if (matched) {
            await prisma.discountAssignment.updateMany({
              where: { discountId: matched.id, userId, used: false },
              data: { used: true },
            });
          }
        }

        console.log(`✅ Processed lead purchase for user ${userId}: leads [${leadIds.join(', ')}]`);
        return res.status(200).json({ received: true });
      } catch (err: any) {
        console.error('🚨 Error processing lead purchase:', err);
        return res.status(500).json({ error: 'Failed to process purchase' });
      }
    }

    // ── 2) SUBSCRIPTION FLOW ────────────────────────────────────────────────
    if (sessionObj.mode === 'subscription' && userId && tierName && stripeSubId) {
      try {
        // fetch Stripe subscription for dates & interval
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
        const interval = stripeSub.items.data[0]?.price.recurring?.interval;
        let plan: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY';
        if (interval === 'year') plan = 'YEARLY';
        else if (interval === 'month') plan = 'MONTHLY';

        const expiresAt = new Date(stripeSub.current_period_end * 1000);

        // upsert subscription row
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: 'ACTIVE',
            tierName,
            expiresAt,
            stripeSubscriptionId: stripeSubId,
          },
          create: {
            userId,
            stripeSubscriptionId: stripeSubId,
            plan,
            status: 'ACTIVE',
            tierName,
            credits: 10,
            expiresAt,
          },
        });

        // ensure we don't duplicate transaction
        const exists = await prisma.transaction.findFirst({
          where: { reference: stripeSub.id }
        });
        if (!exists) {
          await prisma.transaction.create({
            data: {
              userId,
              amount: stripeSub.items.data[0]?.price.unit_amount
                ? stripeSub.items.data[0].price.unit_amount / 100
                : 0,
              type: 'SUBSCRIPTION',
              status: 'SUCCESS',
              reference: stripeSub.id,
            }
          });
        }

        console.log(`✅ Subscription upserted for user ${userId}: ${tierName} (${plan})`);
        return res.status(200).json({ received: true });
      } catch (err: any) {
        console.error('🚨 Error saving subscription:', err);
        return res.status(500).json({ error: 'Subscription error' });
      }
    }
  }

  // default
  return res.status(200).json({ received: true });
}
