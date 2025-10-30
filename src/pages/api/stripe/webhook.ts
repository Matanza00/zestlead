// pages/api/stripe/webhook.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getIO } from '@/lib/socket';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
} as any);

const prisma = new PrismaClient();

// --- Subscription discount helpers ---

type PlanKey = 'STARTER' | 'GROWTH' | 'PRO';

// Map display names or metadata to a stable PlanKey
function normalizePlanKey(input?: string | null): PlanKey {
  const v = (input || '').trim().toUpperCase();
  if (v.includes('PRO')) return 'PRO';
  if (v.includes('GROWTH')) return 'GROWTH';
  if (v.includes('STARTER')) return 'STARTER';
  // Fallback: exact slug
  if (v === 'PRO' || v === 'GROWTH' || v === 'STARTER') return v as PlanKey;
  // Last resort starter
  return 'STARTER';
}

// Reuse or create a subscription discount for the user.
// Growth = 10%, PRO = 20% (Starter = none).
async function grantOrExtendSubscriptionDiscount(opts: {
  userId: string;
  planKey: PlanKey;
  periodEnd: Date; // Stripe subscription current_period_end as Date
}) {
  const { userId, planKey, periodEnd } = opts;

  if (planKey === 'STARTER') return null;

  const targetPercent       = planKey === 'GROWTH' ? 10 : 20;
  const targetAssignments   = planKey === 'GROWTH' ? 100 : 200;
  const descriptionTemplate = `${planKey} subscription discount`;

  // 1) Look for an existing active discount for this user & tier
  const existing = await prisma.discount.findFirst({
    where: {
      active: true,
      percentage: targetPercent,
      description: descriptionTemplate,
      assignedUsers: { some: { userId } },
    },
    include: { assignedUsers: true },
  });

  if (existing) {
    // Extend validity to the new subscription period end if needed
    if (existing.expiresAt && existing.expiresAt < periodEnd) {
      await prisma.discount.update({
        where: { id: existing.id },
        data: { expiresAt: periodEnd },
      });
    }

    // Top up assignment pool if running low (optional)
    const totalAssigned = existing.assignedUsers.length;
    const unused        = existing.assignedUsers.filter(a => !a.used).length;
    const need          = Math.max(0, targetAssignments - totalAssigned);

    if (need > 0 || unused < 10) {
      const toAdd = need > 0 ? need : 20; // small bump if 'unused' is low
      await prisma.discountAssignment.createMany({
        data: Array.from({ length: toAdd }, () => ({
          discountId: existing.id,
          userId,
        })),
      });
    }

    return existing; // ✅ reuse existing code
  }

  // 2) If no matching discount exists, we may be upgrading/downgrading.
  //    Optionally deactivate other active sub-discount codes for this user to avoid confusion:
  await prisma.discount.updateMany({
    where: {
      active: true,
      description: { contains: 'subscription discount' },
      assignedUsers: { some: { userId } },
    },
    data: { active: false },
  });

  // 3) Create a fresh code for this tier (first time or plan change)
  const code = `${planKey}-${userId.slice(0, 6)}-${Date.now().toString(36).toUpperCase()}`;

  const discount = await prisma.discount.create({
    data: {
      code,
      description: descriptionTemplate,
      percentage: targetPercent,
      active: true,
      expiresAt: periodEnd,
      stackable: false,
    },
  });

  await prisma.discountAssignment.createMany({
    data: Array.from({ length: targetAssignments }, () => ({
      discountId: discount.id,
      userId,
    })),
  });

  return discount; // ✅ new code on first-time or on tier change
}

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

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKOUT SESSION COMPLETED
  // ─────────────────────────────────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    const meta = sessionObj.metadata ?? {};
    const userId = meta.userId as string | undefined;
    const csStripeSubId = sessionObj.subscription as string | undefined;
    const tierName = meta.planName as string | undefined;
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
          // 🔔 broadcast live removal
          try {
            const io = getIO();
            io?.emit('lead:unavailable', leadId);
          } catch (e) {
            console.warn('Socket emit failed (lead:unavailable):', e);
          }

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
    if (sessionObj.mode === 'subscription' && userId && tierName && csStripeSubId) {
      try {
        // fetch Stripe subscription for dates & interval
        const stripeSub = await stripe.subscriptions.retrieve(csStripeSubId);

        const price = stripeSub.items.data[0]?.price;
        const interval = price?.recurring?.interval;           // 'month' | 'year'
        const count = price?.recurring?.interval_count ?? 1;   // e.g. 3 => quarterly prepay

        let plan: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY';
        if (interval === 'year') plan = 'YEARLY';
        else if (interval === 'month' && count === 3) plan = 'QUARTERLY';

        const expiresAt = new Date(stripeSub.current_period_end * 1000);

        // upsert subscription row (no credits)
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: 'ACTIVE',
            tierName,
            expiresAt,
            stripeSubscriptionId: stripeSub.id,
          },
          create: {
            userId,
            stripeSubscriptionId: stripeSub.id,
            plan,
            status: 'ACTIVE',
            tierName,
            expiresAt,
          },
        });

        // Issue or extend the per-user discount for Growth/PRO
        await grantOrExtendSubscriptionDiscount({
          userId,
          planKey: normalizePlanKey(tierName || (meta.planName as string) || ''),
          periodEnd: expiresAt,
        });

        // ensure we don't duplicate transaction
        const exists = await prisma.transaction.findFirst({
          where: { reference: stripeSub.id }
        });
        if (!exists) {
          await prisma.transaction.create({
            data: {
              userId,
              amount: price?.unit_amount ? price.unit_amount / 100 : 0,
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

    // done with checkout.session.completed
    return res.status(200).json({ received: true });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INVOICE PAYMENT SUCCEEDED (subscription renewals)
  // ─────────────────────────────────────────────────────────────────────────
  else if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;

    // Only for subscription invoices
    const invStripeSubId =
      typeof invoice.subscription === 'string' ? invoice.subscription : undefined;
    if (!invStripeSubId) {
      return res.status(200).json({ received: true });
    }

    // Find our user + plan from DB (we saved stripeSubscriptionId earlier)
    const subRow = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invStripeSubId },
      select: { userId: true, tierName: true },
    });
    if (!subRow) {
      return res.status(200).json({ received: true });
    }

    // Extend the same code to the new subscription period end
    const stripeSub = await stripe.subscriptions.retrieve(invStripeSubId);
    const periodEnd = new Date((stripeSub.current_period_end as number) * 1000);

    await grantOrExtendSubscriptionDiscount({
      userId: subRow.userId,
      planKey: normalizePlanKey(subRow.tierName),
      periodEnd,
    });

    return res.status(200).json({ received: true });
  }

  // default
  return res.status(200).json({ received: true });
}
