// pages/api/stripe/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { leadId, userId, referralCode } = req.body;

  try {
    // 🟡 1. Fetch lead and price
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead || !lead.price) return res.status(400).json({ error: 'Invalid lead or missing price' });

    let price = lead.price;
    let discountUsedId: string | null = null;
    let stripePromotionId: string | undefined = undefined;

    // 🟢 2. If referral code is provided
    if (referralCode) {
      const discount = await prisma.discount.findFirst({
        where: {
          code: referralCode.toUpperCase(),
          active: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ],
        },
        include: {
          assignedUsers: {
            where: { userId },
          },
        },
      });
    
      console.log("🔍 Found discount:", discount);
    
      const assignment = discount?.assignedUsers?.[0];
      console.log("🎯 Assignment found:", assignment);
    
      if (discount && assignment && !assignment.used && discount.stripePromotionId) {
        discountUsedId = assignment.id;
        stripePromotionId = discount.stripePromotionId;
        console.log("✅ Stripe promo applied:", stripePromotionId);
      }
    }
    
    
    

    console.log("🧪 Using promotion:", stripePromotionId);
    console.log("✅ Applying Stripe Promotion:", stripePromotionId);


    // 🧾 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Lead Purchase',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      discounts: stripePromotionId
      ? [
          {
            promotion_code: stripePromotionId,
          },
        ]
      : undefined,

      metadata: {
        leadId,
        userId,
        discountUsedId: discountUsedId || '',
      },
      success_url: `${req.headers.origin}/stripe/payment-success`,
      cancel_url: `${req.headers.origin}/stripe/payment-cancelled`,
    });

    res.status(200).json({ id: session.id });
  } catch (err: any) {
    console.error('Checkout Error:', err);
    res.status(500).json({ error: err.message });
  }
}
