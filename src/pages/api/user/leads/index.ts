// src/pages/api/user/leads/index.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {

    // pagination
    const page     = Math.max(1, parseInt(String(req.query.page)) || 1);
    const pageSize = Math.max(1, parseInt(String(req.query.pageSize)) || 10);
    const skip     = (page - 1) * pageSize;
    const {
      query = '',
      propertyType,
      tag,
      leadType,
      minBeds,
      minBaths,
      minPrice,
      maxPrice,
    } = req.query;

    // Build filter conditions
    const filters: any = {
      AND: [
        { isAvailable: true },
        { deletedAt: null },
        { purchases: { none: { userId: session.user.id } } },
      ],
    };

    if (query) {
      filters.AND.push({
        OR: [
          // name/contact/email removed from marketplace search
          { desireArea: { contains: String(query), mode: 'insensitive' } },
          { propertyAddress: { contains: String(query), mode: 'insensitive' } },
        ],
      });
    }
    if (propertyType) filters.AND.push({ propertyType: String(propertyType) });
    if (leadType)     filters.AND.push({ leadType: String(leadType) });
    if (minBeds)      filters.AND.push({ beds: { gte: parseFloat(minBeds as string) } });
    if (minBaths)     filters.AND.push({ baths: { gte: parseFloat(minBaths as string) } });
    if (minPrice)     filters.AND.push({ price: { gte: parseFloat(minPrice as string) } });
    if (maxPrice)     filters.AND.push({ price: { lte: parseFloat(maxPrice as string) } });
    if (tag) {
      filters.AND.push({
        tags: { some: { name: { contains: String(tag), mode: 'insensitive' } } },
      });
    }

    try {
      const leads = await prisma.lead.findMany({
        where: filters,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          leadType: true,
          propertyType: true,
          beds: true,
          baths: true,
          desireArea: true,
          propertySize: true,
          priceRange: true,
          price: true,
          paymentMethod: true,
          timeline: true,
          appointment: true,
          isAvailable: true,
          createdAt: true,
          tags: true,
        },
      });
      const hasMore = leads.length === pageSize;
      return res.status(200).json({ leads, hasMore });
    } catch (error) {
      console.error('[API] GET /api/user/leads', error);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
