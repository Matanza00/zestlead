import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const logs = await prisma.activity.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  res.status(200).json(logs);
}
