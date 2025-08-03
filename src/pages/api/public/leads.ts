// src/pages/api/public/leads.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma';

interface PublicLeadsResponse {
  data: Array<{ id: string; name: string; desireArea: string; propertyType: string; timeline: string; leadType: 'BUYER' | 'SELLER' }>;
  total: number;
  page: number;
  pageSize: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PublicLeadsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { page = '1', pageSize = '10', leadType, propertyType, area, available } = req.query;
  const pageNum = parseInt(page as string, 10);
  const size = parseInt(pageSize as string, 12);

  // Build filters
  const filters: any = { deletedAt: null };
  if (leadType) filters.leadType = leadType as string;
  if (propertyType) filters.propertyType = propertyType as string;
  if (area) filters.desireArea = { contains: area as string };
  if (available === 'true') filters.status = 'AVAILABLE';

  try {
    const [total, data] = await Promise.all([
      prisma.lead.count({ where: filters }),
      prisma.lead.findMany({
        where: filters,
        select: { id: true, 
          name: true, 
          desireArea: true, 
          propertyType: true, 
          timeline: true, 
          leadType: true , 
          priceRange: true,
          beds: true,
          baths: true,
        },
        skip: (pageNum - 1) * size,
        take: size,
      }),
    ]);

    return res.status(200).json({ data, total, page: pageNum, pageSize: size });
  } catch (error) {
    console.error('GET /api/public/leads error:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}