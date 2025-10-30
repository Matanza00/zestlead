// src/lib/crm/zoho.ts
export async function zohoCreateLead(accessToken: string, obj: Record<string, any>, instanceUrl = 'https://www.zohoapis.com') {
  const res = await fetch(`${instanceUrl}/crm/v2/Leads`, {
    method: 'POST',
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [obj] }),
  });
  if (!res.ok) throw new Error(`Zoho ${res.status}: ${await res.text()}`);
  return res.json();
}
