type AirtableCfg = {
  apiKey: string;
  baseId: string;
  tableName: string;
};

type Row = Record<string, any>;

async function fetchJSON(url: string, init: RequestInit) {
  const res = await fetch(url, init as any);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Airtable ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export async function testAirtable(cfg: AirtableCfg) {
  // Quick sanity: list one record (or just hit metadata endpoint)
  const url = `https://api.airtable.com/v0/${cfg.baseId}/${encodeURIComponent(cfg.tableName)}?maxRecords=1`;
  await fetchJSON(url, {
    headers: { Authorization: `Bearer ${cfg.apiKey}` }
  });
  return true;
}

export async function insertAirtableRecords(cfg: AirtableCfg, rows: Row[]) {
  // Airtable max 10 records per request is safe
  const chunks: Row[][] = [];
  for (let i = 0; i < rows.length; i += 10) chunks.push(rows.slice(i, i + 10));

  for (const chunk of chunks) {
    const url = `https://api.airtable.com/v0/${cfg.baseId}/${encodeURIComponent(cfg.tableName)}`;
    await fetchJSON(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: chunk.map(fields => ({ fields })) })
    });
  }
}
