import { prisma } from '@/lib/prisma';

export async function isPro(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
    select: { tierName: true }
  });
  return !!sub?.tierName && sub.tierName.toUpperCase().includes('PRO');
}