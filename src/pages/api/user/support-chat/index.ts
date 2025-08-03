import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const messages = await prisma.supportChat.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
    });
    return res.status(200).json(messages);
  }

  if (req.method === 'POST') {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const saved = await prisma.supportChat.create({
    data: {
      userId: session.user.id,
      sender: 'USER',
      message,
    },
  });

  return res.status(200).json(saved);
}


  return res.status(405).json({ error: 'Method not allowed' });
}
