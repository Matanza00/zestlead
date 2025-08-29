// pages/api/discount/validate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
// ⬇️ Adjust this import path if your next-auth config lives elsewhere
import { authOptions }     from "@/lib/auth";  

const prisma = new PrismaClient();

// Normalize output so frontend gets consistent shape
function serializeDiscount(d: any) {
  return {
    code: String(d.code || '').toUpperCase(),
    percentage: Number(d.percentage ?? 0),
    expiresAt: d.expiresAt ? new Date(d.expiresAt).toISOString() : null,
    active: Boolean(d.active ?? true),
    // Optional fields – exist only if your schema has them
    maxCap: typeof d.maxCap === 'number' ? d.maxCap : null
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: list assigned discounts for the logged-in user
  if (req.method === 'GET') {
    try {
      const session = await getServerSession(req, res, authOptions as any);
      const userId = (session?.user as any)?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const now = new Date();

      // Find discounts that are active, assigned to this user,
      // and not expired (or no expiry)
      const discounts = await prisma.discount.findMany({
        where: {
          active: true,
          assignedUsers: { some: { userId } },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        include: {
          assignedUsers: {
            where: { userId },
            select: { id: true, used: true },
          },
        },
        orderBy: [{ expiresAt: 'asc' }],
      });

      // Compute remaining uses for each
      const payload = discounts.map((d) => {
        const total = d.assignedUsers.length;
        const used = d.assignedUsers.filter((a: any) => a.used).length;
        const remaining = Math.max(0, total - used);

        return {
          ...serializeDiscount(d),
          remaining,
        };
      });

      return res.status(200).json(payload);
    } catch (e: any) {
      console.error('GET /api/discount/validate error:', e?.message || e);
      return res.status(500).json({ error: 'Failed to fetch discounts' });
    }
  }

  // POST: validate a specific discount code (keeps your existing behavior)
  if (req.method === 'POST') {
    try {
      const { code } = req.body || {};
      const norm = String(code || '').trim().toUpperCase();
      if (!norm) return res.json({ valid: false, discountPercentage: 0, maxCap: null });

      const session = await getServerSession(req, res, authOptions as any).catch(() => null);
      const userId = (session?.user as any)?.id;

      // Find active discount by code
      const discount = await prisma.discount.findFirst({
        where: {
          code: norm,
          active: true,
        },
      });

      if (!discount) {
        return res.json({ valid: false, discountPercentage: 0, maxCap: null });
      }

      // Expiry check
      if (discount.expiresAt && discount.expiresAt <= new Date()) {
        return res.json({ valid: false, discountPercentage: 0, maxCap: null });
      }

      // If we know the user, ensure they have at least one unused assignment
      if (userId) {
        const assignment = await prisma.discountAssignment.findFirst({
          where: {
            discountId: discount.id,
            userId,
            used: false,
          },
        });
        if (!assignment) {
          return res.json({ valid: false, discountPercentage: 0, maxCap: null });
        }
      }

      return res.json({
        valid: true,
        discountPercentage: Number(discount.percentage ?? 0),
        maxCap: typeof (discount as any).maxCap === 'number' ? (discount as any).maxCap : null,
      });
    } catch (e: any) {
      console.error('POST /api/discount/validate error:', e?.message || e);
      return res.status(200).json({ valid: false, discountPercentage: 0, maxCap: null });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
