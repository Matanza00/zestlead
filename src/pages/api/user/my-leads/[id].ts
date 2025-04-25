import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid lead ID' });

  try {
    const purchase = await prisma.leadPurchase.findUnique({
      where: {
        userId_leadId: {
          userId: session.user.id,
          leadId: id,
        },
      },
      include: {
        lead: true,
      },
    });

    if (!purchase) return res.status(404).json({ error: 'Not found' });

    const { lead, status, createdAt } = purchase;

    res.status(200).json({
      id: lead.id,
      name: lead.name,
      desireArea: lead.desireArea,
      propertyType: lead.propertyType,
      priceRange: lead.priceRange,
      price: lead.price,
      leadType: lead.leadType,
      status,
      createdAt,
    });
  } catch (err) {
    console.error('❌ Error fetching lead:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
