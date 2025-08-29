// src/pages/api/user/account/interests.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1️⃣ Get session server-side
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = session.user.id as string;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { interests: true },
      });
      return res.status(200).json({ interests: user?.interests || null });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load interests' });
    }
  }

  if (req.method === 'POST') {
    const { interests } = req.body;
    if (typeof interests !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { interests },
      });
      return res.status(200).json({ interests });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save interests' });
    }
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
