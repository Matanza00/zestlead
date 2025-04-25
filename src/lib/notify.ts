import { prisma } from './prisma';

export async function createNotification({
  userId,
  type,
  title,
  message,
}: {
  userId: string;
  type: 'PAYMENT' | 'SUBSCRIPTION' | 'SYSTEM' | 'LEAD';
  title: string;
  message: string;
}) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.inAppNotification) return; // respect user setting

  await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });
}
