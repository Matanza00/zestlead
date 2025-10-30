// src/lib/crm/insightly.ts
export async function createInsightlyLead(apiKey: string, obj: Record<string, any>) {
  // Insightly uses Basic Auth: base64(apiKey:)
  const auth = Buffer.from(`${apiKey}:`).toString('base64');
  const res = await fetch('https://api.insightly.com/v3.1/Leads', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  });
  if (!res.ok) throw new Error(`Insightly ${res.status}: ${await res.text()}`);
  return res.json();
}






