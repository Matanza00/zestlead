// pages/api/stripe/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import {prisma} from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { leadId, leadIds, userId, referralCode } = req.body as {
    leadId?: string;
    leadIds?: string[];
    userId: string;
    referralCode?: string;
  };

  // Normalize to array
  const ids = leadIds ?? (leadId ? [leadId] : []);
  if (ids.length === 0) {
    return res.status(400).json({ error: 'No leads provided.' });
  }

  try {
    // 1️⃣ Fetch all leads
    const leads = await prisma.lead.findMany({ where: { id: { in: ids } } });
    if (leads.length !== ids.length) {
      return res.status(400).json({ error: 'Some leads not found.' });
    }

    // 2️⃣ Lookup discount assignments
    let discountPercent = 0;
    let assignmentIds: string[] = [];
    if (referralCode) {
      const discount = await prisma.discount.findFirst({
        where: {
          code: referralCode.toUpperCase(),
          active: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: { assignedUsers: { where: { userId, used: false } } },
      });
      if (discount) {
        discountPercent = discount.percentage;
        assignmentIds = discount.assignedUsers
          .slice(0, leads.length)
          .map((a) => a.id);
      }
    }

    // 3️⃣ Build line_items with per-item discount
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = leads.map((lead, idx) => {
      const baseAmount = Math.round((lead.price ?? 0) * 100);
      const finalAmount = idx < assignmentIds.length
        ? Math.round(baseAmount * (1 - discountPercent / 100))
        : baseAmount;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: lead.name,
            description: lead.propertyType,
          },
          unit_amount: finalAmount,
        },
        quantity: 1,
      };
    });

    // 4️⃣ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      metadata: {
        userId,
        leadIds: JSON.stringify(ids),
        assignmentIds: JSON.stringify(assignmentIds),
      },
      success_url: `${req.headers.origin}/stripe/payment-success`,
      cancel_url: `${req.headers.origin}/stripe/payment-cancelled`,
    });

    return res.status(200).json({ id: session.id });
  } catch (err: any) {
    console.error('🛑 Checkout Error:', err);
    return res.status(500).json({ error: err.message });
  }
}