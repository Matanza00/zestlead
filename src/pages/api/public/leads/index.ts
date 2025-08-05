// src/pages/api/public/leads/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

interface PublicLeadSummary {
  id: string;
  name: string;
  desireArea: string | null;
  priceRange: string | null;
  propertyType: string;
  beds: number | null;
  baths: number | null;
  leadType: 'BUYER' | 'SELLER';
  timeline: string | null;
}

interface PublicLeadsResponse {
  data: PublicLeadSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PublicLeadsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    page = '1',
    pageSize = '10',
    leadType,
    propertyType,
    area,
  } = req.query;
  const pageNum = parseInt(page as string, 10);
  const size = parseInt(pageSize as string, 10);

  const filters: any = {
    isAvailable: true,
    deletedAt: null,
  };
  if (leadType)       filters.leadType = String(leadType);
  if (propertyType)   filters.propertyType = String(propertyType);
  if (area)           filters.desireArea = { contains: String(area), mode: 'insensitive' };

  try {
    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * size,
        take: size,
        select: {
          id: true,
          name: true,
          desireArea: true,
          priceRange: true,
          propertyType: true,
          beds: true,
          baths: true,
          leadType: true,
          timeline: true,
        },
      }),
      prisma.lead.count({ where: filters }),
    ]);

    return res.status(200).json({ data, total, page: pageNum, pageSize: size });
  } catch (error) {
    console.error('GET /api/public/leads error:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}