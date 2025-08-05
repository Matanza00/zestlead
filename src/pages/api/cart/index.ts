// pages/api/cart/index.ts
import { getServerSession } from 'next-auth/next';
import { authOptions }      from '@/lib/auth';
import { prisma }           from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const userId = session.user.id;

  if (req.method === 'GET') {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { lead: true },
    });
    return res.json(items);
  }

  if (req.method === 'POST') {
    const { leadId } = req.body as { leadId: string };
    try {
      const item = await prisma.cartItem.upsert({
        where: {
          userId_leadId: { userId, leadId }  // your unique compound index
        },
        create: { userId, leadId },
        update: {},                           // no data changes on update
        include: { lead: true },
      });
      return res.status(201).json(item);
    } catch (err: any) {
      console.error('Cart upsert error', err);
      return res.status(500).json({ error: 'Could not add to cart' });
    }
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
