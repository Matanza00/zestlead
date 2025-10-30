type HubSpotAuth = {
  accessToken: string;
  // refreshToken/portalId optional for now
};

async function hsFetch(path: string, auth: HubSpotAuth, init: RequestInit) {
  const res = await fetch(`https://api.hubapi.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function hubspotCreateOrUpdateContact(auth: HubSpotAuth, props: Record<string, any>) {
  // Simple create; you may want to upsert by email if available (search then update)
  return hsFetch('/crm/v3/objects/contacts', auth, {
    method: 'POST',
    body: JSON.stringify({ properties: props })
  });
}
