import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/crypto';

export async function ensureSalesforceAccessToken(crmConnectionId: string) {
  const conn = await prisma.crmConnection.findUnique({ where: { id: crmConnectionId } });
  if (!conn) throw new Error('Salesforce connection not found');

  const stillValid = conn.expiresAt && conn.expiresAt.getTime() > Date.now() + 120000;
  if (stillValid) return decrypt(conn.accessToken!);

  if (!conn.refreshToken) throw new Error('No Salesforce refresh token saved');

  const base = (process.env.SF_LOGIN_BASE || 'https://login.salesforce.com').replace(/\/+$/,'');
  const res = await fetch(`${base}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.SF_CLIENT_ID!,
      client_secret: process.env.SF_CLIENT_SECRET!,
      refresh_token: decrypt(conn.refreshToken),
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error('Salesforce refresh failed: ' + JSON.stringify(data));

  const expiresAt = data.expires_in
    ? new Date(Date.now() + (Number(data.expires_in) - 60) * 1000)
    : new Date(Date.now() + 2 * 60 * 60 * 1000);

  await prisma.crmConnection.update({
    where: { id: conn.id },
    data: {
      accessToken: encrypt(data.access_token),
      expiresAt,
      // instance_url not always returned on refresh; keep existing if missing
      instanceUrl: data.instance_url || conn.instanceUrl || undefined,
    }
  });

  return data.access_token as string;
}
