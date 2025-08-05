// src/pages/api/user/my-leads/[id].ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.query as { id: string };

  // READ a specific purchase (by purchaseId or by leadId)
  if (req.method === 'GET') {
    try {
      const purchase = await prisma.leadPurchase.findFirst({
        where: {
          userId: session.user.id,
          OR: [
            { id: id },
            { leadId: id }
          ]
        },
        include: {
          lead: {
            include: { tags: true }
          }
        },
      });
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      return res.status(200).json(purchase);
    } catch (err) {
      console.error('[API] GET /api/user/my-leads/[id]', err);
      return res.status(500).json({ error: 'Failed to fetch purchase' });
    }
  }

  // DELETE (cancel) a purchase by purchaseId or leadId
  if (req.method === 'DELETE') {
    try {
      // first find the purchase record
      const purchase = await prisma.leadPurchase.findFirst({
        where: {
          userId: session.user.id,
          OR: [
            { id: id },
            { leadId: id }
          ]
        }
      });
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      await prisma.leadPurchase.delete({
        where: { id: purchase.id },
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[API] DELETE /api/user/my-leads/[id]', err);
      return res.status(500).json({ error: 'Failed to cancel purchase' });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
