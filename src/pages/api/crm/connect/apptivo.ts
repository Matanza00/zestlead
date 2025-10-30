// pages/api/crm/connect/apptivo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const session = await getServerSession(req, res, authOptions as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const { apiKey, apiKey2, baseUrl, fieldMapping } = req.body as {
    apiKey: string;
    apiKey2?: string;
    baseUrl: string;
    fieldMapping?: Record<string,string>;
  };
  if (!apiKey || !baseUrl) return res.status(400).json({ error: 'apiKey and baseUrl required' });

  const row = await prisma.crmConnection.upsert({
    where: { userId_provider: { userId: session.user.id, provider: 'APPTIVO' } },
    update: {
      authType: 'API_KEY',
      apiKey: encrypt(apiKey),
      apiKey2: apiKey2 ? encrypt(apiKey2) : null,
      metadata: { baseUrl },
      fieldMapping: fieldMapping || undefined,
    },
    create: {
      userId: session.user.id,
      provider: 'APPTIVO',
      authType: 'API_KEY',
      apiKey: encrypt(apiKey),
      apiKey2: apiKey2 ? encrypt(apiKey2) : null,
      metadata: { baseUrl },
      fieldMapping: fieldMapping || undefined,
    },
  });
  res.json({ ok: true, id: row.id });
}
