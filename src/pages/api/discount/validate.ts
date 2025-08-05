// pages/api/discount/validate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { code } = req.body as { code?: string };
  if (!code) {
    return res.status(400).json({ valid: false });
  }

  // 1️⃣ Lookup discount by code
  const discount = await prisma.discount.findFirst({
    where: {
      code: code.toUpperCase(),
      active: true,
      deletedAt: null, // ensure it's not deleted
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  // 2️⃣ Not found or expired?
  if (!discount) {
    return res.json({ valid: false });
  }

  // 3️⃣ Success: return percent *and* maxCap (in dollars, or null for ∞)
  return res.json({
    valid: true,
    discountPercentage: discount.percentage,
    maxCap: discount.maxCap ?? null,
  });
}
