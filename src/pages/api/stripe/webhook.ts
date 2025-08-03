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
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    if (!sig) return res.status(400).send('Missing Stripe signature');
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    const meta = sessionObj.metadata ?? {};
    const userId = meta.userId as string | undefined;
    const tierName = meta.planName as string | undefined;
    const stripeSubId = sessionObj.subscription as string | undefined;
    const discountUsedId = meta.discountUsedId as string | undefined;

    const hasLeadPurchase = meta.leadIds || meta.leadId;

    // 🎯 Handle Lead Purchases
    if (hasLeadPurchase) {
      let leadIds: string[] = [];
      if (meta.leadIds) {
        try {
          leadIds = JSON.parse(meta.leadIds as string);
        } catch {
          console.warn('Invalid JSON for leadIds:', meta.leadIds);
        }
      } else if (meta.leadId) {
        leadIds = [meta.leadId as string];
      }

      let assignmentIds: string[] = [];
      if (meta.assignmentIds) {
        try {
          assignmentIds = JSON.parse(meta.assignmentIds as string);
        } catch {
          console.warn('Invalid JSON for assignmentIds:', meta.assignmentIds);
        }
      }

      if (!userId || leadIds.length === 0) {
        console.error('❌ Missing userId or leadIds in metadata', meta);
        return res.status(400).json({ error: 'Missing userId or leadIds' });
      }

      try {
        for (const leadId of leadIds) {
          const lead = await prisma.lead.findUnique({ where: { id: leadId } });
          if (!lead) continue;

          await prisma.leadPurchase.upsert({
            where: { userId_leadId: { userId, leadId } },
            update: { status: 'NOT_CONTACTED' },
            create: {
              userId,
              leadId,
              status: 'NOT_CONTACTED',
              ...(discountUsedId ? { discountUsedId } : {}),
            },
          });

          await prisma.lead.update({
            where: { id: leadId },
            data: { isAvailable: false },
          });

          await prisma.transaction.create({
            data: {
              userId,
              amount: lead.price || 0,
              type: 'LEAD_PURCHASE',
              status: 'SUCCESS',
              reference: sessionObj.id,
            },
          });

          await prisma.cartItem.deleteMany({ where: { userId, leadId } });

          const { createNotification } = await import('@/lib/notify');
          await createNotification({
            userId,
            type: 'PAYMENT',
            title: 'Payment Successful',
            message: `Your payment of PKR ${lead.price?.toLocaleString()} for lead "${lead.name}" was successful.`,
          });

          if (discountUsedId) {
            await prisma.discountAssignment.update({
              where: { id: discountUsedId },
              data: { used: true },
            });
          }
        }

        if (assignmentIds.length > 0) {
          await prisma.discountAssignment.updateMany({
            where: { id: { in: assignmentIds } },
            data: { used: true },
          });
        }

        const promoCodeId = sessionObj.total_details?.breakdown?.discounts?.[0]?.promotion_code as string | undefined;
        if (promoCodeId) {
          const promo = await stripe.promotionCodes.retrieve(promoCodeId);
          const matchedDiscount = await prisma.discount.findFirst({
            where: { stripePromotionId: promo.id },
            include: { assignedUsers: true },
          });
          if (matchedDiscount) {
            await prisma.discountAssignment.updateMany({
              where: { discountId: matchedDiscount.id, userId, used: false },
              data: { used: true },
            });
          }
        }

        console.log(`✅ Processed purchase for user ${userId}: leads [${leadIds.join(', ')}]`);
        return res.status(200).json({ received: true });
      } catch (err: any) {
        console.error('🚨 Error processing lead purchase:', err);
        return res.status(500).json({ error: 'Failed to process purchase' });
      }
    }

    // 🎯 Handle Subscription Creation/Update
    if (userId && tierName && stripeSubId) {
      try {
        const stripeSub: Stripe.Subscription = await stripe.subscriptions.retrieve(stripeSubId);
        const billingInterval = stripeSub.items.data[0]?.price.recurring?.interval;
        let plan: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY';
        if (billingInterval === 'year') plan = 'YEARLY';
        else if (billingInterval === 'month') plan = 'MONTHLY';

        const expiresAt = new Date(stripeSub.current_period_end * 1000);

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

        const existingTxn = await prisma.transaction.findFirst({
          where: { reference: stripeSub.id }
        });

        if (!existingTxn) {
          await prisma.transaction.create({
            data: {
              userId,
              amount: stripeSub.items.data[0]?.price.unit_amount ? stripeSub.items.data[0].price.unit_amount / 100 : 0,
              type: 'SUBSCRIPTION',
              status: 'SUCCESS',
              reference: stripeSub.id,
            },
          });
        }


        console.log(`✅ Subscription created for user ${userId} — ${tierName} (${plan})`);
        return res.status(200).json({ received: true });
      } catch (err) {
        console.error('🚨 Error saving subscription:', err);
        return res.status(500).json({ error: 'Subscription error' });
      }
    }
  }

  return res.status(200).json({ received: true });
}
