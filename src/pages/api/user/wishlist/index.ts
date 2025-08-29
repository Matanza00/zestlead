// src/pages/api/user/wishlist/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
  const userId = session.user.id as string;

  if (req.method === 'GET') {
    // List all wishlist entries for this user
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { lead: true },
    });
    return res.status(200).json(wishlist);
  }

  if (req.method === 'POST') {
    // Add a lead to wishlist
    const { leadId } = req.body as { leadId?: string };
    if (!leadId) return res.status(400).json({ error: 'leadId is required' });
    try {
      const entry = await prisma.wishlist.create({
        data: { userId, leadId },
        include: { lead: true },
      });
      return res.status(201).json(entry);
    } catch (err: any) {
      if (err.code === 'P2002') { // unique constraint
        return res.status(409).json({ error: 'Already in wishlist' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  }

  res.setHeader('Allow', ['GET','POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
