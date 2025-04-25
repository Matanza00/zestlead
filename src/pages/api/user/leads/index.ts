// src/pages/api/user/leads/index.ts
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
    const leads = await prisma.lead.findMany({
      where: {
        isAvailable: true,
        deletedAt: null,
        purchases: {
          none: {
            userId: session.user.id
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        propertyType: true,
        desireArea: true,
        priceRange: true,
        price: true,
        leadType: true,
        createdAt: true
      }
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error('[API] /api/user/leads', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
