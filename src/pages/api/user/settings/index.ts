import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const {
    emailNotification,
    inAppNotification,
    notifyPayment,
    notifySubscription,
    enable2FA
  } = req.body;

  // Update User settings
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      emailNotification,
      inAppNotification,
      notifyPayment,
      notifySubscription
    }
  });

  // Update or create TwoFactorAuth record
  if (typeof enable2FA === 'boolean') {
    await prisma.twoFactorAuth.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, enabled: enable2FA },
      update: { enabled: enable2FA }
    });
  }

  return res.status(200).json({ success: true });
}
