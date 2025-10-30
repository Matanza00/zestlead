// pages/api/crm/connect/zapier.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const session = await getServerSession(req, res, authOptions as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const { webhookUrl, fieldMapping } = req.body as {
    webhookUrl: string;
    fieldMapping?: Record<string,string>;
  };
  if (!webhookUrl) return res.status(400).json({ error: 'webhookUrl required' });

  try {
    // (optional) ping Zapier with a test
    await fetch(webhookUrl, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ test: true }) });

    const row = await prisma.crmConnection.upsert({
      where: { userId_provider: { userId: session.user.id, provider: 'ZAPIER' } },
      update: { authType: 'API_KEY', metadata: { webhookUrl }, fieldMapping: fieldMapping || undefined },
      create: { userId: session.user.id, provider: 'ZAPIER', authType: 'API_KEY', metadata: { webhookUrl }, fieldMapping: fieldMapping || undefined },
    });
    res.json({ ok: true, id: row.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Invalid webhook' });
  }
}
