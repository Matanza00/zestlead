// pages/api/stripe/webhook.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { createNotification } from '@/lib/notify';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!sig) {
      return res.status(400).send('Missing Stripe signature');
    }

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const leadId = session.metadata?.leadId;
    const userId = session.metadata?.userId;
    const discountUsedId = session.metadata?.discountUsedId || undefined;

    if (!leadId || !userId) {
      console.error("❌ Missing leadId or userId in metadata");
      return res.status(400).json({ error: 'Missing leadId or userId in metadata' });
    }

    try {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) return res.status(404).json({ error: 'Lead not found' });

      // 💾 Upsert LeadPurchase
      await prisma.leadPurchase.upsert({
        where: {
          userId_leadId: { userId, leadId },
        },
        update: {
          status: 'NOT_CONTACTED',
        },
        create: {
          userId,
          leadId,
          status: 'NOT_CONTACTED',
          discountUsedId,
        },
      });

      // 🔒 Mark lead as unavailable
      await prisma.lead.update({
        where: { id: leadId },
        data: { isAvailable: false },
      });

      // 💸 Log transaction
      await prisma.transaction.create({
        data: {
          userId,
          amount: lead.price || 0,
          type: 'LEAD_PURCHASE',
          status: 'SUCCESS',
          reference: session.id,
        },
      });

      await createNotification({
        userId,
        type: 'PAYMENT',
        title: 'Payment Successful',
        message: `Your payment of PKR ${lead.price?.toLocaleString()} for lead "${lead.name}" was successful.`,
      });

      // 🟢 Mark manually assigned referral as used
      if (discountUsedId) {
        await prisma.discountAssignment.update({
          where: { id: discountUsedId },
          data: { used: true },
        });
      }

      // 🔁 If code was entered manually, mark assignment used if matched
      const promoCodeId = session.total_details?.breakdown?.discounts?.[0]?.promotion_code;

      if (promoCodeId && !discountUsedId) {
        const promo = await stripe.promotionCodes.retrieve(promoCodeId);

        const matchedDiscount = await prisma.discount.findFirst({
          where: { stripePromotionId: promo.id },
          include: { assignedUsers: true },
        });

        if (matchedDiscount) {
          await prisma.discountAssignment.updateMany({
            where: {
              discountId: matchedDiscount.id,
              userId,
              used: false,
            },
            data: { used: true },
          });
        }
      }

      console.log(`✅ Lead ${leadId} purchased by user ${userId} (discount: ${discountUsedId || promoCodeId || 'none'})`);
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('🚨 Error processing purchase:', err);
      return res.status(500).json({ error: 'Failed to process purchase' });
    }
  }

  return res.status(200).json({ received: true });
}
