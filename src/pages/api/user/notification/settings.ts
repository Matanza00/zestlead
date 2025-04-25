// pages/api/user/notification/settings.ts
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).end();

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailNotification: true,
        inAppNotification: true,
        notifyPayment: true,
        notifySubscription: true,
      },
    });
    return res.status(200).json(user);
  }

  if (req.method === 'POST') {
    const { emailNotification, inAppNotification, notifyPayment, notifySubscription } = req.body;
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailNotification,
        inAppNotification,
        notifyPayment,
        notifySubscription,
      },
    });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
