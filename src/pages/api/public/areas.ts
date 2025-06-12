// src/pages/api/public/areas.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const allLeads = await prisma.lead.findMany({ where: { deletedAt: null }, select: { desireArea: true } });
    const areaSet = new Set<string>();

    allLeads.forEach(({ desireArea }) => {
      const parts = desireArea.split(',').map(p => p.trim());
      const len = parts.length;
      if (len >= 2) {
        const cityState = `${parts[len - 2]}, ${parts[len - 1]}`;
        areaSet.add(cityState);
      }
    });

    return res.status(200).json(Array.from(areaSet).sort());
  } catch (error) {
    console.error('GET /api/public/areas error:', error);
    return res.status(500).json({ error: 'Failed to fetch areas' });
  }
}