// pages/api/user/my-leads/index.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const purchases = await prisma.leadPurchase.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
      include: {
        lead: true // 👈 this is what was missing
      }
    });

    const formatted = purchases.map((purchase) => ({
      id: purchase.lead.id,
      name: purchase.lead.name,
      desireArea: purchase.lead.desireArea,
      propertyType: purchase.lead.propertyType,
      priceRange: purchase.lead.priceRange,
      price: purchase.lead.price,
      leadType: purchase.lead.leadType,
      status: purchase.status,
      createdAt: purchase.createdAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('❌ Error in /api/user/my-leads:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
