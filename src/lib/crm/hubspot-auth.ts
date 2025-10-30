// src/lib/crm/hubspot-auth.ts
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/crypto';

export async function ensureHubSpotAccessToken(crmConnectionId: string) {
  const conn = await prisma.crmConnection.findUnique({ where: { id: crmConnectionId } });
  if (!conn) throw new Error('HubSpot connection not found');

  const stillValid = conn.expiresAt && conn.expiresAt.getTime() > Date.now() + 120000;
  if (stillValid) return decrypt(conn.accessToken!);

  if (!conn.refreshToken) throw new Error('No refresh token saved');

  const res = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
      refresh_token: decrypt(conn.refreshToken),
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error('HubSpot refresh failed: ' + JSON.stringify(data));

  const expiresAt = new Date(Date.now() + (data.expires_in - 60) * 1000);
  await prisma.crmConnection.update({
    where: { id: conn.id },
    data: { accessToken: encrypt(data.access_token), expiresAt }
  });

  return data.access_token as string;
}
