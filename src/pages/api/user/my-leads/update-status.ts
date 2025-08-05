// src/pages/api/user/my-leads/update-status.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LeadInteractionStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { purchaseId, status: rawStatus } = req.body as { purchaseId: string; status: string };
  if (!purchaseId || !rawStatus) {
    return res.status(400).json({ error: 'Missing purchaseId or status' });
  }

  // Validate status against enum values
  const status = rawStatus as LeadInteractionStatus;
  if (!Object.values(LeadInteractionStatus).includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await prisma.leadPurchase.update({
      where: { id: purchaseId },
      data: { status },
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error('[API] POST /api/user/my-leads/update-status', err);
    return res.status(500).json({ error: 'Failed to update status' });
  }
}
