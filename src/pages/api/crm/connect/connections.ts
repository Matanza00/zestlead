import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const rows = await prisma.crmConnection.findMany({
      where: { userId: session.user.id },
      select: { id: true, provider: true, authType: true, metadata: true, updatedAt: true }
    });
    return res.json({ connections: rows });
  }

  if (req.method === 'DELETE') {
    const provider = (req.query.provider as string || '').toUpperCase();
    if (!provider) return res.status(400).json({ error: 'provider required' });
    await prisma.crmConnection.deleteMany({ where: { userId: session.user.id, provider: provider as any } });
    return res.json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end();
}
