// src/pages/api/user/leads/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1️⃣ Authenticate
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = session.user.id;

  // 2️⃣ Pagination + Base Filters
  const page     = Math.max(1, parseInt(String(req.query.page))  || 1);
  const pageSize = Math.max(1, parseInt(String(req.query.pageSize)) || 10);
  const skip     = (page - 1) * pageSize;

  const {
    query = '',
    propertyType,
    leadType,
    minBeds,
    minBaths,
    minPrice,
    maxPrice,
  } = req.query;

  const baseFilter: any = {
    AND: [
      { isAvailable: true },
      { deletedAt: null },
      { purchases: { none: { userId } } },
    ],
  };

  if (query) {
    baseFilter.AND.push({
      OR: [
        { desireArea:      { contains: String(query), mode: 'insensitive' } },
        { propertyAddress: { contains: String(query), mode: 'insensitive' } },
      ],
    });
  }
  if (propertyType) baseFilter.AND.push({ propertyType: String(propertyType) });
  if (leadType)     baseFilter.AND.push({ leadType: String(leadType) });
  if (minBeds)      baseFilter.AND.push({ beds:  { gte: +minBeds } });
  if (minBaths)     baseFilter.AND.push({ baths: { gte: +minBaths } });
  if (minPrice)     baseFilter.AND.push({ price: { gte: +minPrice } });
  if (maxPrice)     baseFilter.AND.push({ price: { lte: +maxPrice } });

  try {
    // 3️⃣ Load user interests
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { interests: true },
    });
    const interests = userRecord?.interests ?? { propertyTypes: [], desireAreas: [] };

    const { propertyTypes, desireAreas } = interests;

    // 4️⃣ Matched leads (interest-based)
    const matched = await prisma.lead.findMany({
      where: {
        AND: [
          baseFilter,
          {
            OR: [
              { propertyType: { in: propertyTypes } },
              { desireArea:   { in: desireAreas   } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
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

    // 5️⃣ Other leads (excluding matched)
    //    If matched.length < pageSize, we’ll fill the rest with “others”
    let others: typeof matched = [];
    if (matched.length < pageSize) {
      others = await prisma.lead.findMany({
        where: {
          AND: [
            baseFilter,
            {
              AND: [
                { propertyType: { notIn: propertyTypes } },
                { desireArea:   { notIn: desireAreas   } },
              ],
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        skip:  skip > matched.length ? skip - matched.length : 0,
        take: pageSize - matched.length,
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
    }

    // 6️⃣ Combine and return
    const leads = [...matched, ...others];
    const hasMore = leads.length === pageSize;

    return res.status(200).json({ leads, hasMore });
  } catch (err) {
    console.error('[API] GET /api/user/leads error:', err);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
}
