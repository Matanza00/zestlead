// src/pages/api/admin/dashboard/summary.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LeadInteractionStatus, SubscriptionStatus } from '@prisma/client';

// ---- time helpers
function startOfWeek(d = new Date()) {
  // Monday start
  const x = new Date(d);
  const day = x.getDay(); // 0..6 (Sun..Sat)
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const session = (await getServerSession(req, res, authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // -------- Core totals (from your schema) --------
    const [totalUsers, totalLeads, totalPurchasedLeads, totalClosedDeals] = await Promise.all([
      prisma.user.count(),
      prisma.lead.count({ where: { deletedAt: null } }),
      prisma.leadPurchase.count({ where: { deletedAt: null } }),
      prisma.leadPurchase.count({
        where: { deletedAt: null, status: LeadInteractionStatus.CLOSED },
      }),
    ]);

    // Subscribed users (ACTIVE only, per your enum)
    const totalSubscribedUsers = await prisma.subscription.count({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    // Optional totals that exist in your schema
    const [totalReferrals, totalDiscountCodes] = await Promise.all([
      prisma.referral.count(),
      prisma.discount.count({ where: { deletedAt: null } }),
    ]);

    // -------- Revenue (gross): sum of Lead.price for all purchases --------
    // If you want to switch to Transactions later, we can change it.
    const purchasesForRevenue = await prisma.leadPurchase.findMany({
      where: { deletedAt: null },
      select: { lead: { select: { price: true } } },
    });
    const totalRevenueGross = purchasesForRevenue.reduce((sum, p) => {
      const price = Number(p.lead?.price ?? 0);
      return sum + (isFinite(price) ? price : 0);
    }, 0);

    // -------- Weekly series (last 8 weeks): closed deals & revenue --------
    const now = new Date();
    const currentWeekStart = startOfWeek(now);
    const weeks: { start: Date; end: Date; label: string }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      weeks.push({
        start,
        end,
        label: start.toISOString(), // format on client
      });
    }
    const eightWeeksAgo = new Date(weeks[0].start);

    const [closedPurchases, purchasesForWeeklyRevenue] = await Promise.all([
      prisma.leadPurchase.findMany({
        where: {
          deletedAt: null,
          status: LeadInteractionStatus.CLOSED,
          updatedAt: { gte: eightWeeksAgo },
        },
        select: { updatedAt: true },
      }),
      prisma.leadPurchase.findMany({
        where: { deletedAt: null, createdAt: { gte: eightWeeksAgo } },
        select: { createdAt: true, lead: { select: { price: true } } },
      }),
    ]);

    const closedWeekly = weeks.map(({ start, end, label }) => {
      const count = closedPurchases.filter((p) => p.updatedAt >= start && p.updatedAt < end).length;
      return { weekStart: label, count };
    });

    const revenueWeekly = weeks.map(({ start, end, label }) => {
      const value = purchasesForWeeklyRevenue
        .filter((p) => p.createdAt >= start && p.createdAt < end)
        .reduce((sum, p) => sum + Number(p.lead?.price ?? 0), 0);
      return { weekStart: label, value };
    });

    // -------- Recent purchases (admin-wide) --------
    const recentPurchases = await prisma.leadPurchase.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        createdAt: true,
        status: true,
        user: { select: { id: true, name: true, email: true} },
        lead: {
          select: {
            id: true,
            name: true,
            contact: true,
            email: true,
            desireArea: true,
            price: true,
            leadType: true,
            beds: true,
            baths: true,
          },
        },
      },
    });

    // -------- Response --------
    return res.status(200).json({
      totals: {
        users: totalUsers,
        subscribedUsers: totalSubscribedUsers,
        leads: totalLeads,
        purchasedLeads: totalPurchasedLeads,
        closedDeals: totalClosedDeals,
        referrals: totalReferrals,
        discountCodes: totalDiscountCodes,
        revenue: { gross: totalRevenueGross, currency: 'USD' }, // adjust currency if needed
      },
      charts: {
        closedWeekly,   // [{ weekStart, count }]
        revenueWeekly,  // [{ weekStart, value }]
      },
      recentPurchases: recentPurchases.map((p) => ({
        id: p.id,
        purchasedAt: p.createdAt,
        status: p.status,
        buyer: { id: p.user.id, name: p.user.name, email: p.user.email },
        lead: p.lead,
      })),
    });
  } catch (err) {
    console.error('[API] /api/admin/dashboard/summary error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
