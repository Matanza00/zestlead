// pages/api/user/notifications/[id]/read.ts
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).end();

  const { id } = req.query;

  await prisma.notification.updateMany({
    where: { id: id as string, userId: session.user.id },
    data: { read: true },
  });

  res.status(200).json({ success: true });
}
