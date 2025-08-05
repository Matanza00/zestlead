// src/pages/api/public/leads/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid lead ID' });
  }

  try {
    // Fetch lead including tags
    const lead = await prisma.lead.findFirst({
      where: { id, deletedAt: null, isAvailable: true },
      include: { tags: true }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Determine purchase status
    const session = await getServerSession(req, res, authOptions);
    let isPurchased = false;
    if (session?.user?.id) {
      const purchase = await prisma.leadPurchase.findFirst({
        where: { leadId: id, userId: session.user.id }
      });
      isPurchased = Boolean(purchase);
    }

    // Prepare response
    const {
      contact,
      email,
      deletedAt,
      isAvailable,
      ...publicFields
    } = lead;

    return res.status(200).json({
      ...publicFields,
      contact: isPurchased ? contact : undefined,
      email: isPurchased ? email : undefined,
      isPurchased,
    });
  } catch (err) {
    console.error('[public lead view error]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
