// pages/api/stripe/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// ---- Buy-delay helpers ----
type PlanKey = 'STARTER' | 'GROWTH' | 'PRO';
function normalizePlanKey(name?: string | null): PlanKey {
  const v = (name || '').toUpperCase();
  if (v.includes('PRO')) return 'PRO';
  if (v.includes('GROWTH')) return 'GROWTH';
  if (v.includes('STARTER')) return 'STARTER';
  return 'STARTER';
}
function requiredDelayMsForTier(tier: PlanKey) {
  if (tier === 'PRO') return 0;
  if (tier === 'GROWTH') return 2 * 60 * 60 * 1000;  // 2h
  return 24 * 60 * 60 * 1000;                        // 24h for STARTER/others
}


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

  const ids = leadIds ?? (leadId ? [leadId] : []);
  if (ids.length === 0) {
    return res.status(400).json({ error: 'No leads provided.' });
  }

  try {
    // 1) Resolve user's active subscription & tier
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      select: { tierName: true },
    });
    const tier = normalizePlanKey(sub?.tierName);
    const delayMs = requiredDelayMsForTier(tier);


    // 2) Load the leads we’re checking out (need price/propertyType/isAvailable)
    const leads = await prisma.lead.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        createdAt: true,
        price: true,
        propertyType: true,
        isAvailable: true,
      },
    });

    // 3) Compute eligibility per lead
    const now = Date.now();
    const blocked = leads
      .map(l => {
        const eligibleAt = new Date(l.createdAt.getTime() + delayMs);
        const waitMs = eligibleAt.getTime() - now;
        return waitMs > 0
          ? {
              id: l.id,
              name: l.name,
              eligibleAt: eligibleAt.toISOString(),
              waitMinutes: Math.ceil(waitMs / 60000),
            }
          : null;
      })
      .filter(Boolean) as Array<{id:string;name?:string;eligibleAt:string;waitMinutes:number}>;

    // 4) If any lead is too new, block checkout with details
    if (blocked.length > 0) {
      return res.status(409).json({
        error: 'LEADS_NOT_ELIGIBLE',
        tier,
        blocked,
        message:
          tier === 'PRO'
            ? 'PRO should be instant; please contact support.'
            : 'Some leads are not yet eligible to buy for your subscription tier.',
      });
    }


    // 2️⃣ Lookup discount/referral
    let discountPercent = 0;
    let maxCapCents = Infinity;
    let assignmentIds: string[] = [];

    if (referralCode) {
      const discount = await prisma.discount.findFirst({
        where: {
          code: referralCode.toUpperCase(),
          active: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: {
          assignedUsers: { where: { userId, used: false } }
        },
      });

      if (discount) {
        discountPercent = discount.percentage;
        // convert maxCap (dollars) to cents; if null, leave as Infinity
        maxCapCents = discount.maxCap != null
          ? Math.round(discount.maxCap * 100)
          : Infinity;

        // only assign as many usages as leads
        assignmentIds = discount.assignedUsers
          .slice(0, leads.length)
          .map(a => a.id);
      }
    }

    // 3️⃣ Build line_items with per-item cap
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = leads.map((lead, idx) => {
      const baseCents = Math.round((lead.price ?? 0) * 100);

      if (idx < assignmentIds.length) {
        // calculate raw discount and clamp to maxCapCents
        const rawDiscount = Math.round(baseCents * (discountPercent / 100));
        const discountCents = Math.min(rawDiscount, maxCapCents);
        const finalCents = baseCents - discountCents;

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: lead.name,
              description: lead.propertyType,
            },
            unit_amount: finalCents,
          },
          quantity: 1,
        };
      } else {
        // no discount
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: lead.name,
              description: lead.propertyType,
            },
            unit_amount: baseCents,
          },
          quantity: 1,
        };
      }
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
