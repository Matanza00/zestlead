// pages/api/user/my-leads/update-status.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method !== 'POST') return res.status(405).end();
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const { leadId, status } = req.body;

  if (!leadId || !status) {
    return res.status(400).json({ error: 'Missing leadId or status' });
  }

  try {
    await prisma.leadPurchase.update({
      where: {
        userId_leadId: {
          userId: session.user.id,
          leadId,
        },
      },
      data: {
        status,
      },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Failed to update lead status:', err);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
}
