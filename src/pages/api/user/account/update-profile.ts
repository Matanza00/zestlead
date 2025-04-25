import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method !== 'POST') return res.status(405).end();
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid name' });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Failed to update profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
