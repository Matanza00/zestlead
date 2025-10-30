import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyState } from '@/lib/oauth/state';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code  = String(req.query.code || '');
  const state = String(req.query.state || '');
  const parsed = verifyState(state);
  if (!code || !parsed || parsed.provider !== 'ZOHO') {
    return res.status(400).send('Invalid state or code');
    }

  const accountsBase = (process.env.ZOHO_ACCOUNTS_BASE || 'https://accounts.zoho.com').replace(/\/+$/,'');
  const tokenRes = await fetch(`${accountsBase}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      redirect_uri: process.env.ZOHO_REDIRECT_URI!,
      code,
    }),
  });

  const data = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error('Zoho token error:', data);
    return res.status(400).json(data);
  }

  // Zoho responds with api_domain (e.g., https://www.zohoapis.com or regional)
  const apiDomain = data.api_domain || 'https://www.zohoapis.com';
  const expiresAt = new Date(Date.now() + ((data.expires_in || 3600) - 60) * 1000);

  await prisma.crmConnection.upsert({
    where: { userId_provider: { userId: parsed.userId, provider: 'ZOHO' } },
    update: {
      authType: 'OAUTH',
      accessToken: encrypt(data.access_token),
      refreshToken: data.refresh_token ? encrypt(data.refresh_token) : undefined,
      expiresAt,
      instanceUrl: apiDomain,
    },
    create: {
      userId: parsed.userId,
      provider: 'ZOHO',
      authType: 'OAUTH',
      accessToken: encrypt(data.access_token),
      refreshToken: data.refresh_token ? encrypt(data.refresh_token) : null,
      expiresAt,
      instanceUrl: apiDomain,
    },
  });

  res.redirect('/user/integrations?connected=zoho');
}
