import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyState } from '@/lib/oauth/state';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code  = String(req.query.code || '');
  const state = String(req.query.state || '');
  const parsed = verifyState(state);
  if (!code || !parsed || parsed.provider !== 'SALESFORCE') {
    return res.status(400).send('Invalid state or code');
  }

  const base = (process.env.SF_LOGIN_BASE || 'https://login.salesforce.com').replace(/\/+$/,'');
  const tokenRes = await fetch(`${base}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SF_CLIENT_ID!,
      client_secret: process.env.SF_CLIENT_SECRET!,
      redirect_uri: process.env.SF_REDIRECT_URI!,
      code,
    }),
  });

  const token = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error('Salesforce token error:', token);
    return res.status(400).json(token);
  }

  const expiresAt = token.expires_in
    ? new Date(Date.now() + (Number(token.expires_in) - 60) * 1000)
    : new Date(Date.now() + 2 * 60 * 60 * 1000); // fallback 2h

  await prisma.crmConnection.upsert({
    where: { userId_provider: { userId: parsed.userId, provider: 'SALESFORCE' } },
    update: {
      authType: 'OAUTH',
      accessToken: encrypt(token.access_token),
      refreshToken: token.refresh_token ? encrypt(token.refresh_token) : undefined,
      expiresAt,
      instanceUrl: token.instance_url, // REQUIRED for API calls
    },
    create: {
      userId: parsed.userId,
      provider: 'SALESFORCE',
      authType: 'OAUTH',
      accessToken: encrypt(token.access_token),
      refreshToken: token.refresh_token ? encrypt(token.refresh_token) : null,
      expiresAt,
      instanceUrl: token.instance_url,
    }
  });

  res.redirect('/user/integrations?connected=salesforce');
}
