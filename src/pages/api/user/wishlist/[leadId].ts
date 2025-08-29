// src/pages/api/user/wishlist/[leadId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
  const userId = session.user.id as string;
  const { leadId } = req.query as { leadId: string };

  if (req.method === 'DELETE') {
    try {
      await prisma.wishlist.deleteMany({
        where: { userId, leadId },
      });
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
