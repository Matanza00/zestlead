// pages/api/discount/validate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code } = req.body;
  if (!code) return res.status(400).json({ valid: false });

  const discount = await prisma.discount.findFirst({
    where: {
      code: code.toUpperCase(),
      active: true,
      deletedAt: null,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  res.status(200).json({
  valid: !!discount,
  discountPercentage: discount?.percentage || 0,
});

}
