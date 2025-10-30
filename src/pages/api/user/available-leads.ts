import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const session = await getServerSession(req, res, authOptions as any);
  const session = await getServerSession(req, res, {} as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const q = (req.query.q as string)?.trim();
  const limit = Number(req.query.limit ?? 50);

  const leads = await prisma.lead.findMany({
    where: {
      isAvailable: true,
      ...(q ? {
        OR: [
          { name: { contains: q } },
          { propertyType: { contains: q } },
          { desireArea: { contains: q } },
        ]
      } : {})
    },
    select: { id: true, name: true, price: true, propertyType: true, desireArea: true },
    take: Math.min(100, Math.max(1, limit))
  });

  res.json({ leads });
}
