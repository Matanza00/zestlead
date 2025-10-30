// src/lib/crm/salesforce.ts
export async function sfCreateLead(instanceUrl: string, accessToken: string, obj: Record<string, any>) {
  const res = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Lead`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  });
  if (!res.ok) throw new Error(`Salesforce ${res.status}: ${await res.text()}`);
  return res.json();
}