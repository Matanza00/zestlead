// src/pages/api/public/property-types.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma';

// Return unique propertyType values for dynamic filtering
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const types = await prisma.lead.findMany({
      where: { deletedAt: null },
      distinct: ['propertyType'],
      select: { propertyType: true },
    });
    const uniqueTypes = types
      .map((t) => t.propertyType)
      .filter((v, i, arr) => v && arr.indexOf(v) === i);

    return res.status(200).json(uniqueTypes.sort());
  } catch (error) {
    console.error('GET /api/public/property-types error:', error);
    return res.status(500).json({ error: 'Failed to fetch property types' });
  }
}