import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/crypto';

export async function ensureZohoAccessToken(crmConnectionId: string) {
  const conn = await prisma.crmConnection.findUnique({ where: { id: crmConnectionId } });
  if (!conn) throw new Error('Zoho connection not found');

  const stillValid = conn.expiresAt && conn.expiresAt.getTime() > Date.now() + 120000;
  if (stillValid) return decrypt(conn.accessToken!);

  if (!conn.refreshToken) throw new Error('No Zoho refresh token saved');

  const accountsBase = (process.env.ZOHO_ACCOUNTS_BASE || 'https://accounts.zoho.com').replace(/\/+$/,'');
  const res = await fetch(`${accountsBase}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: decrypt(conn.refreshToken),
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error('Zoho refresh failed: ' + JSON.stringify(data));

  const expiresAt = new Date(Date.now() + ((data.expires_in || 3600) - 60) * 1000);
  // May return api_domain again; if present, keep it up-to-date
  const instanceUrl = data.api_domain || conn.instanceUrl || 'https://www.zohoapis.com';

  await prisma.crmConnection.update({
    where: { id: conn.id },
    data: { accessToken: encrypt(data.access_token), expiresAt, instanceUrl }
  });

  return data.access_token as string;
}
