import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const session = await getServerSession(req, res, authOptions as any);
  const session = await getServerSession(req, res, {} as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: 'Email required' });

  // upsert pending invite; unique pair prevents duplicates per referrer
  const invite = await prisma.referral.upsert({
    where: {
      referrerId_referredEmail: { referrerId: session.user.id, referredEmail: email }
    },
    update: { status: 'PENDING' },
    create: {
      referrerId: session.user.id,
      referredEmail: email,
      status: 'PENDING'
    }
  });

  // TODO: optionally send an email with your signup link + ?ref=CODE
  return res.json({ ok: true, invite });
}
