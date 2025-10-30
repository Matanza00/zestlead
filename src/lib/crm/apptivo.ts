// src/lib/crm/apptivo.ts
export async function apptivoCreateLead(apiKey: string, apiKey2: string | undefined, baseUrl: string, obj: Record<string, any>) {
  // Many Apptivo setups require API key + access key in headers; adapt here
  const headers: Record<string,string> = { 'Content-Type': 'application/json', 'x-api-key': apiKey };
  if (apiKey2) headers['x-access-key'] = apiKey2;

  const res = await fetch(`${baseUrl.replace(/\/+$/,'')}/api/v1/leads`, {
    method: 'POST',
    headers,
    body: JSON.stringify(obj),
  });
  if (!res.ok) throw new Error(`Apptivo ${res.status}: ${await res.text()}`);
  return res.json();
}