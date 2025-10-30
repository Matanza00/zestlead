import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';
import { testAirtable } from '@/lib/crm/airtable';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const session = await getServerSession(req, res, authOptions as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const { apiKey, baseId, tableName, fieldMapping } = req.body as {
    apiKey: string; baseId: string; tableName: string; fieldMapping?: Record<string,string>;
  };
  if (!apiKey || !baseId || !tableName) return res.status(400).json({ error: 'Missing fields' });

  try {
    // verify credentials
    await testAirtable({ apiKey, baseId, tableName });

    const record = await prisma.crmConnection.upsert({
      where: { userId_provider: { userId: session.user.id, provider: 'AIRTABLE' } },
      update: {
        authType: 'API_KEY',
        apiKey: encrypt(apiKey),
        metadata: { baseId, tableName },
        fieldMapping: fieldMapping || undefined,
      },
      create: {
        userId: session.user.id,
        provider: 'AIRTABLE',
        authType: 'API_KEY',
        apiKey: encrypt(apiKey),
        metadata: { baseId, tableName },
        fieldMapping: fieldMapping || undefined,
      }
    });

    res.json({ ok: true, id: record.id });
  } catch (e: any) {
    console.error('Airtable connect failed', e);
    res.status(400).json({ error: e.message || 'Invalid Airtable credentials' });
  }
}
