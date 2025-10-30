// src/pages/api/user/referrals/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next'; // ✅ use /next for Pages API routes
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions); // ✅ pass real options
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      referralCode: true,
      freeLeadCredits: true,
      email: true,
      name: true,
      referrals: {
        select: {
          id: true,
          referredEmail: true,
          status: true,
          rewardedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!me) return res.status(404).json({ error: 'User not found' });
  // referralCode should always exist, but just in case, generate one
    if (!me.referralCode) {
    const newCode = (await import('nanoid')).nanoid(10); // or custom generator
    await prisma.user.update({ where: { id: me.id }, data: { referralCode: newCode } });
    me.referralCode = newCode;
    }


  const stats = {
    total: me.referrals.length,
    pending: me.referrals.filter(r => r.status === 'PENDING').length,
    signedUp: me.referrals.filter(r => r.status === 'SIGNED_UP').length,
    subscribed: me.referrals.filter(r => r.status === 'SUBSCRIBED').length,
    rewarded: me.referrals.filter(r => r.status === 'REWARDED').length,
  };

  return res.json({
    referralCode: me.referralCode,
    freeLeadCredits: me.freeLeadCredits,
    stats,
    referrals: me.referrals,
  });
}
