// pages/api/crm/connect/insightly.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const session = await getServerSession(req, res, authOptions as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const { apiKey, fieldMapping } = req.body as { apiKey: string; fieldMapping?: Record<string,string> };
  if (!apiKey) return res.status(400).json({ error: 'apiKey required' });

  const row = await prisma.crmConnection.upsert({
    where: { userId_provider: { userId: session.user.id, provider: 'INSIGHTLY' } },
    update: { authType: 'API_KEY', apiKey: encrypt(apiKey), fieldMapping: fieldMapping || undefined },
    create: { userId: session.user.id, provider: 'INSIGHTLY', authType: 'API_KEY', apiKey: encrypt(apiKey), fieldMapping: fieldMapping || undefined },
  });
  res.json({ ok: true, id: row.id });
}
