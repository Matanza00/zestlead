// pages/api/user/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the user has any active subscriptions
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE' // You can adjust this logic if needed
          }
        }
      }
    });

    

    const isSubscribed = (user?.subscriptions?.length ?? 0) > 0;

    return res.status(200).json({ isSubscribed });
  } catch (error) {
    console.error('API Error - /api/user/me:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
