// src/pages/api/user/my-leads/index.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // parse pagination params (default to page 1, 10 items per page)
      const page     = Math.max(1, parseInt(String(req.query.page)) || 1);
      const pageSize = Math.max(1, parseInt(String(req.query.pageSize)) || 10);
      const skip     = (page - 1) * pageSize;

      const purchases = await prisma.leadPurchase.findMany({
        where: { userId: session.user.id },
        include: {
          lead: { include: { tags: true } },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });

      const results = purchases.map((p) => ({
        purchaseId: p.id,
        leadId: p.leadId,
        status: p.status,
        purchasedAt: p.createdAt,
        updatedAt: p.updatedAt,
        lead: p.lead,
      }));

      // tell client if there’s more
      const hasMore = purchases.length === pageSize;
      // return under "purchases" key to match front-end expectation
      return res.status(200).json({ purchases: results, hasMore});
    } catch (err) {
      console.error('[API] GET /api/user/my-leads', err);
      return res.status(500).json({ error: 'Failed to fetch your leads' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}