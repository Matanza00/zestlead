// pages/api/stripe/webhook.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let event: Stripe.Event;

  // 1️⃣ Verify webhook signature
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

  // 2️⃣ Handle checkout session completed
  if (event.type === 'checkout.session.completed') {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    const meta = sessionObj.metadata ?? {};
    const userId = meta.userId as string | undefined;
    const discountUsedId = meta.discountUsedId as string | undefined;

    // parse leadIds (array or single)
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

    // parse assignmentIds for promo usage
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

    // 3️⃣ Process each purchased lead
    try {
      for (const leadId of leadIds) {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) continue;

        // upsert purchase record
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

        // mark lead as unavailable
        await prisma.lead.update({
          where: { id: leadId },
          data: { isAvailable: false },
        });

        // log transaction
        await prisma.transaction.create({
          data: {
            userId,
            amount: lead.price || 0,
            type: 'LEAD_PURCHASE',
            status: 'SUCCESS',
            reference: sessionObj.id,
          },
        });

        // clear from cart
        await prisma.cartItem.deleteMany({ where: { userId, leadId } });

        // send in-app/email notification
        const { createNotification } = await import('@/lib/notify');
        await createNotification({
          userId,
          type: 'PAYMENT',
          title: 'Payment Successful',
          message: `Your payment of PKR ${lead.price?.toLocaleString()} for lead "${lead.name}" was successful.`,
        });

        // mark discount assignment used if provided
        if (discountUsedId) {
          await prisma.discountAssignment.update({
            where: { id: discountUsedId },
            data: { used: true },
          });
        }
      }

      // 4️⃣ Mark all assignmentIds as used
      if (assignmentIds.length > 0) {
        await prisma.discountAssignment.updateMany({
          where: { id: { in: assignmentIds } },
          data: { used: true },
        });
      }

      // 5️⃣ Fallback: handle any Stripe promotion codes
      const promoCodeId = sessionObj.total_details?.breakdown?.discounts?.[0]?.promotion_code;
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
      console.error('🚨 Error processing purchase:', err);
      return res.status(500).json({ error: 'Failed to process purchase' });
    }
  }

  // 6️⃣ Return 200 for other events
  return res.status(200).json({ received: true });
}

