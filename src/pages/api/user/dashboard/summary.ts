// src/pages/api/user/dashboard/summary.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';            // ✅ add
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LeadInteractionStatus } from '@prisma/client';

// ---- time helpers
function startOfLocalDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function startOfWeek(d = new Date()) {
  // Monday as start-of-week. Change if you prefer Sunday.
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

  // ✅ cast session so TS knows it has .user
  const session = (await getServerSession(req, res, authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = session.user.id as string;


  try {
    const now = new Date();
    const todayStart = startOfLocalDay(now);
    const last3Days = daysAgo(3);
    const last7Days = daysAgo(7);

    // -------- NEW LEADS (uploaded/updated in window; exclude soft-deleted)
    const [newLeads7, newLeads3, newLeadsToday] = await Promise.all([
      prisma.lead.count({
        where: {
          deletedAt: null,
          OR: [{ createdAt: { gte: last7Days } }, { updatedAt: { gte: last7Days } }],
        },
      }),
      prisma.lead.count({
        where: {
          deletedAt: null,
          OR: [{ createdAt: { gte: last3Days } }, { updatedAt: { gte: last3Days } }],
        },
      }),
      prisma.lead.count({
        where: {
          deletedAt: null,
          OR: [{ createdAt: { gte: todayStart } }, { updatedAt: { gte: todayStart } }],
        },
      }),
    ]);

    // -------- PURCHASED LEADS (for this user)
    const [purchasedTotal, purchasedLast7] = await Promise.all([
      prisma.leadPurchase.count({ where: { userId, deletedAt: null } }),
      prisma.leadPurchase.count({
        where: { userId, deletedAt: null, createdAt: { gte: last7Days } },
      }),
    ]);

    // -------- CONTACTED LEADS (status changed to CONTACTED)
    const [contactedTotal, contactedLast7] = await Promise.all([
      prisma.leadPurchase.count({
        where: { userId, deletedAt: null, status: LeadInteractionStatus.CONTACTED },
      }),
      prisma.leadPurchase.count({
        where: {
          userId,
          deletedAt: null,
          status: LeadInteractionStatus.CONTACTED,
          updatedAt: { gte: last7Days },
        },
      }),
    ]);

    // -------- DEALS CLOSED (weekly counts over last 4 weeks)
    const weeks: { start: Date; end: Date }[] = [];
    const currentWeekStart = startOfWeek(now);
    for (let i = 3; i >= 0; i--) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      weeks.push({ start, end });
    }
    const fourWeeksAgo = new Date(weeks[0].start);

    // Pull candidates only once, then bucket in-memory
    const closedCandidates = await prisma.leadPurchase.findMany({
      where: {
        userId,
        deletedAt: null,
        status: LeadInteractionStatus.CLOSED,
        updatedAt: { gte: fourWeeksAgo },
      },
      select: { id: true, updatedAt: true },
    });

    const weekly = weeks.map(({ start, end }) => {
      const count = closedCandidates.filter((p) => p.updatedAt >= start && p.updatedAt < end)
        .length;
      return { weekStart: start.toISOString(), count };
    });
    const totalClosedLast4Weeks = weekly.reduce((a, b) => a + b.count, 0);

    // -------- RECENTLY PURCHASED (table)
    const recentPurchases = await prisma.leadPurchase.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        lead: {
          include: { tags: true },
        },
      },
    });

    // -------- 7-day daily area for "new leads"
    const dailyArea: { date: string; newLeads: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = startOfLocalDay(daysAgo(i));
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const c = await prisma.lead.count({
        where: {
          deletedAt: null,
          OR: [
            { createdAt: { gte: start, lt: end } },
            { updatedAt: { gte: start, lt: end } },
          ],
        },
      });
      dailyArea.push({ date: start.toISOString(), newLeads: c });
    }

    return res.status(200).json({
      newLeads: { last7: newLeads7, last3: newLeads3, today: newLeadsToday },
      purchasedLeads: { total: purchasedTotal, last7: purchasedLast7 },
      contactedLeads: { total: contactedTotal, last7: contactedLast7 },
      dealClosed: { weekly, totalLast4Weeks: totalClosedLast4Weeks },
      recentPurchases: recentPurchases.map((p) => ({
        id: p.id,
        purchasedAt: p.createdAt,
        status: p.status,
        lead: {
          id: p.lead.id,
          leadType: p.lead.leadType,
          name: p.lead.name,
          contact: p.lead.contact,
          email: p.lead.email,
          propertyType: p.lead.propertyType,
          beds: p.lead.beds,
          baths: p.lead.baths,
          desireArea: p.lead.desireArea,
          propertySize: p.lead.propertySize,
          priceRange: p.lead.priceRange,
          price: p.lead.price,
          paymentMethod: p.lead.paymentMethod,
          timeline: p.lead.timeline,
          appointment: p.lead.appointment,
          createdAt: p.lead.createdAt,
          tags: p.lead.tags,
        },
      })),
      charts: {
        // Bar can use weekly closed. If you want more series later (e.g., contacted), we can add it.
        bar: weekly, // [{ weekStart, count }]
        area: dailyArea, // [{ date, newLeads }]
      },
    });
  } catch (err) {
    console.error('[API] /api/user/dashboard/summary error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
