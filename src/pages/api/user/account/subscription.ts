// pages/api/user/account/subscription.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const sub = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: { not: 'CANCELLED' }, // optional
    },
  });

  if (!sub) {
    return res.status(200).json({
      plan: null,
      tierName: null,
      status: 'None',
      credits: 0,
      expiresAt: null,
      stripeSubscriptionId: null,
    });
  }

  return res.status(200).json({
    plan: sub.plan,
    tierName: sub.tierName,
    status: sub.status,
    credits: sub.credits,
    expiresAt: sub.expiresAt,
    stripeSubscriptionId: sub.stripeSubscriptionId,
  });
}
