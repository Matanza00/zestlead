// src/pages/api/user/leads/[id].ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = session.user.id;
  const { id: leadId } = req.query as { id: string };

  switch (req.method) {
    // READ a single lead for marketplace (only if not purchased)
    case 'GET': {
      const lead = await prisma.lead.findFirst({
        where: {
          id: leadId,
          isAvailable: true,
          deletedAt: null,
          purchases: { none: { userId } },
        },
        select: {
          id: true,
          leadType: true,
          propertyType: true,
          beds: true,
          baths: true,
          desireArea: true,
          propertySize: true,
          propertyAddress: true,
          parcelId: true,
          askingPrice: true,
          marketValue: true,
          priceRange: true,
          price: true,
          paymentMethod: true,
          preApproved: true,
          hasRealtor: true,
          timeline: true,
          appointment: true,
          notes: true,
          specialRequirements: true,
          audioFileUrl: true,
          isAvailable: true,
          createdAt: true,
          updatedAt: true,
          tags: true,
        },
      });

      if (!lead) {
        return res.status(404).json({ error: 'Lead not found or already purchased' });
      }
      return res.status(200).json(lead);
    }

    // PURCHASE the lead
    case 'PUT': {
      const available = await prisma.lead.findFirst({
        where: {
          id: leadId,
          isAvailable: true,
          deletedAt: null,
          purchases: { none: { userId } },
        },
      });
      if (!available) {
        return res.status(404).json({ error: 'Lead not available for purchase' });
      }
      try {
        const purchase = await prisma.leadPurchase.create({
          data: { userId, leadId }
        });
        return res.status(201).json({ success: true, purchase });
      } catch (err) {
        console.error('Lead purchase failed:', err);
        return res.status(500).json({ error: 'Purchase failed' });
      }
    }

    // CANCEL purchase
    case 'DELETE': {
      try {
        const result = await prisma.leadPurchase.deleteMany({
          where: { userId, leadId }
        });
        if (result.count === 0) {
          return res.status(404).json({ error: 'No purchase found to cancel' });
        }
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error('Cancel purchase failed:', err);
        return res.status(500).json({ error: 'Cancellation failed' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
