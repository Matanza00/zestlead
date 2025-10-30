// pages/api/crm/oauth/hubspot/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyState } from '@/lib/oauth/state';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code  = String(req.query.code || '');
  const state = String(req.query.state || '');
  const parsed = verifyState(state);
  if (!code || !parsed || parsed.provider !== 'HUBSPOT') {
    return res.status(400).send('Invalid state or code');
  }

  const tokenRes = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
      redirect_uri: process.env.HUBSPOT_REDIRECT_URI!,
      code
    }),
  });

  const token = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error('HubSpot token error:', token);
    return res.status(400).json(token);
  }

  const expiresAt = new Date(Date.now() + (token.expires_in - 60) * 1000);

  await prisma.crmConnection.upsert({
    where: { userId_provider: { userId: parsed.userId, provider: 'HUBSPOT' } },
    update: {
      authType:   'OAUTH',
      accessToken: encrypt(token.access_token),
      refreshToken: token.refresh_token ? encrypt(token.refresh_token) : undefined,
      expiresAt,
      metadata: { hubId: token.hub_id }, // optional: portal info
    },
    create: {
      userId: parsed.userId,
      provider: 'HUBSPOT',
      authType: 'OAUTH',
      accessToken: encrypt(token.access_token),
      refreshToken: token.refresh_token ? encrypt(token.refresh_token) : null,
      expiresAt,
      metadata: { hubId: token.hub_id },
    }
  });

  // Back to integrations UI
  res.redirect('/user/integrations?connected=hubspot');
}
