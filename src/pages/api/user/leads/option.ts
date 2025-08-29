// pages/api/leads/options.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    // get distinct property types and areas
    const types = await prisma.lead.findMany({
      distinct: ['propertyType'],
      select: { propertyType: true },
    });
    const areas = await prisma.lead.findMany({
      distinct: ['desireArea'],
      where: { desireArea: { not: null } },
      select: { desireArea: true },
    });

    return res.status(200).json({
      propertyTypes: types.map((t) => t.propertyType),
      desireAreas: areas.map((a) => a.desireArea!),
    });
  } catch (err) {
    console.error('GET /api/leads/options error:', err);
    return res.status(500).json({ error: 'Failed to load options' });
  }
}
