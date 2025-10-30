// pages/api/user/referrals/codes.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s = await getServerSession(req, res, authOptions);
  if (!s?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const rows = await prisma.discountAssignment.findMany({
    where: { userId: s.user.id, used: false, discount: { active: true } },
    include: { discount: true },
    orderBy: { assignedAt: 'desc' },
  });

  res.json({
    codes: rows.map(r => ({
      assignmentId: r.id,
      code: r.discount.code,
      description: r.discount.description,
      percentage: r.discount.percentage,
      maxCapUSD: r.discount.maxCap,
      assignedAt: r.assignedAt,
    })),
  });
}
