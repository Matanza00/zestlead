// /api/admin/support-chat/users.ts
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany({
  where: {
    supportChats: {
      some: {}, // Users who have any support chat messages
    },
  },
  include: {
    supportChats: {
      orderBy: { createdAt: 'desc' },
      take: 1,
    },
  },
  });

  res.status(200).json(users);
}
