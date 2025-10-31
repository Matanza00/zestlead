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

  if (req.method === 'GET') {
    try {
      const purchase = await prisma.leadPurchase.findFirst({
        where: {
          userId: session.user.id,
          OR: [{ id }, { leadId: id }],
        },
        include: { lead: { include: { tags: true } } },
      });
      if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
      return res.status(200).json(purchase);
    } catch (err) {
      console.error('[API] GET /api/user/my-leads/[id]', err);
      return res.status(500).json({ error: 'Failed to fetch purchase' });
    }
  }

  // NEW: update status & notes
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = req.body || {};
      let { status, notes } = body as { status?: string; notes?: string };

      // Normalize & validate status (if provided)
      const allowed = new Set(['CONTACTED', 'NOT_CONTACTED', 'NO_RESPONSE', 'CLOSED']);
      let normalizedStatus: 'CONTACTED' | 'NOT_CONTACTED' | 'NO_RESPONSE' | 'CLOSED' | undefined = undefined;
      if (typeof status === 'string' && status.trim()) {
        const tempStatus = status.toString().trim().toUpperCase().replace(/\s+/g, '_');
        if (!allowed.has(tempStatus)) {
          return res.status(400).json({ error: 'Invalid status' });
        }
        normalizedStatus = tempStatus as 'CONTACTED' | 'NOT_CONTACTED' | 'NO_RESPONSE' | 'CLOSED';
      }

      // Find the user's purchase by purchaseId or leadId
      const purchase = await prisma.leadPurchase.findFirst({
        where: {
          userId: session.user.id,
          OR: [{ id }, { leadId: id }],
        },
        select: { id: true, leadId: true },
      });

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      // Build transactional updates
      const tx: any[] = [];

      if (typeof notes === 'string') {
        tx.push(
          prisma.lead.update({
            where: { id: purchase.leadId },
            data: { notes },
          })
        );
      }

      if (normalizedStatus) {
        tx.push(
          prisma.leadPurchase.update({
            where: { id: purchase.id },
            data: { status: normalizedStatus },
          })
        );
      }

      // If nothing to update, still return current purchase
      if (tx.length) {
        await prisma.$transaction(tx);
      }

      // Return refreshed shape matching GET
      const refreshed = await prisma.leadPurchase.findUnique({
        where: { id: purchase.id },
        include: {
          lead: { include: { tags: true } },
        },
      });

      return res.status(200).json(refreshed);
    } catch (err) {
      console.error('[API] PUT /api/user/my-leads/[id]', err);
      return res.status(500).json({ error: 'Failed to update purchase' });
    }
  }


  if (req.method === 'DELETE') {
    try {
      const purchase = await prisma.leadPurchase.findFirst({
        where: {
          userId: session.user.id,
          OR: [{ id }, { leadId: id }],
        },
      });
      if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
      await prisma.leadPurchase.delete({ where: { id: purchase.id } });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[API] DELETE /api/user/my-leads/[id]', err);
      return res.status(500).json({ error: 'Failed to cancel purchase' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
