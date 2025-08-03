// pages/api/admin/support-chat/[userId].ts
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (typeof userId !== 'string') return res.status(400).json({ error: 'Invalid userId' });

  if (req.method === 'GET') {
  const messages = await prisma.supportChat.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

    return res.status(200).json(messages);
  }

  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await prisma.supportChat.create({
      data: {
        userId,
        message,
        sender: 'ADMIN',
      },
    });

    return res.status(200).json(reply);
  }

  return res.status(405).end();
}
