// pages/api/crm/export.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isPro } from '@/lib/subscription';
import { decrypt } from '@/lib/crypto';
import { insertAirtableRecords } from '@/lib/crm/airtable';
import { postToZapier } from '@/lib/crm/zapier';
import { hubspotCreateOrUpdateContact } from '@/lib/crm/hubspot';
import { zohoCreateLead } from '@/lib/crm/zoho';
import { sfCreateLead } from '@/lib/crm/salesforce';
import { createInsightlyLead } from '@/lib/crm/insightly';
import { apptivoCreateLead } from '@/lib/crm/apptivo';
import type { ProviderKey } from '@/lib/crm/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }

  const session = await getServerSession(req, res, authOptions as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });
  if (!(await isPro(session.user.id))) return res.status(403).json({ error: 'CRM export is PRO only' });

  const { provider, leadIds } = req.body as { provider: ProviderKey; leadIds: string[] };
  if (!provider || !Array.isArray(leadIds) || leadIds.length === 0) {
    return res.status(400).json({ error: 'provider and leadIds required' });
  }

  const conn = await prisma.crmConnection.findUnique({
    where: { userId_provider: { userId: session.user.id, provider } }
  });
  if (!conn) return res.status(400).json({ error: `No ${provider} connection configured` });

  const purchases = await prisma.leadPurchase.findMany({
    where: { userId: session.user.id, leadId: { in: leadIds } },
    include: {
      lead: {
        select: {
          id: true, name: true, contact: true, desireArea: true,
          propertyType: true, priceRange: true, price: true, leadType: true, createdAt: true
        }
      }
    }
  });

  const mapping = (conn.fieldMapping as any) || {
    name: 'Name', contact: 'Contact', desireArea: 'Area',
    propertyType: 'Property Type', priceRange: 'Price Range',
    price: 'Price', leadType: 'Lead Type', purchasedAt: 'Purchased At',
  };

  // Our normalized export rows (field names on the RIGHT are the destination names)
  const rows = purchases.map(p => {
    const L = p.lead!;
    return {
      [mapping.name]:         L.name || '',
      [mapping.contact]:      L.contact || '',
      [mapping.desireArea]:   L.desireArea || '',
      [mapping.propertyType]: L.propertyType || '',
      [mapping.priceRange]:   L.priceRange || '',
      [mapping.price]:        L.price ?? '',
      [mapping.leadType]:     L.leadType || '',
      [mapping.purchasedAt]:  p.createdAt.toISOString(),
    };
  });

  try {
    switch (provider) {
      case 'AIRTABLE': {
        const { baseId, tableName } = (conn.metadata || {}) as any;
        if (!conn.apiKey || !baseId || !tableName) throw new Error('Airtable connection incomplete');
        await insertAirtableRecords({ apiKey: decrypt(conn.apiKey), baseId, tableName }, rows);
        return res.json({ ok: true, exported: rows.length });
      }
      case 'ZAPIER': {
        const { webhookUrl } = (conn.metadata || {}) as any;
        if (!webhookUrl) throw new Error('Zapier webhook not set');
        // One payload with all rows; you can loop to send one per item if your Zap expects that
        await postToZapier(webhookUrl, { records: rows });
        return res.json({ ok: true, exported: rows.length });
      }
      case 'HUBSPOT': {
        if (!conn.accessToken) throw new Error('HubSpot not connected');
        for (const r of rows) {
          await hubspotCreateOrUpdateContact({ accessToken: decrypt(conn.accessToken) }, {
            firstname: r[mapping.name],
            phone:     r[mapping.contact],
            city:      r[mapping.desireArea],
            // Add more property mappings as your portal allows
          });
        }
        return res.json({ ok: true, exported: rows.length });
      }
      case 'ZOHO': {
        if (!conn.accessToken) throw new Error('Zoho not connected');
        const base = (conn.instanceUrl as string) || 'https://www.zohoapis.com';
        for (const r of rows) {
          await zohoCreateLead(decrypt(conn.accessToken), {
            Company: 'ZestLead',  // or a real value if you have it
            Last_Name: r[mapping.name] || 'Lead',
            Phone: r[mapping.contact] || '',
            City: r[mapping.desireArea] || '',
            Description: `Imported from ZestLead on ${new Date().toISOString()}`,
          }, base);
        }
        return res.json({ ok: true, exported: rows.length });
      }
      case 'SALESFORCE': {
        if (!conn.accessToken || !conn.instanceUrl) throw new Error('Salesforce not connected');
        for (const r of rows) {
          await sfCreateLead(conn.instanceUrl, decrypt(conn.accessToken), {
            LastName: r[mapping.name] || 'Lead',
            Phone: r[mapping.contact] || '',
            City: r[mapping.desireArea] || '',
            Company: 'ZestLead', // or mapped
            Description: `Imported from ZestLead on ${new Date().toISOString()}`
          });
        }
        return res.json({ ok: true, exported: rows.length });
      }
      case 'INSIGHTLY': {
        if (!conn.apiKey) throw new Error('Insightly not connected');
        for (const r of rows) {
          await createInsightlyLead(decrypt(conn.apiKey), {
            FIRST_NAME: r[mapping.name],
            PHONE_NUMBER: r[mapping.contact],
            LEAD_DESCRIPTION: `Imported from ZestLead`,
            // map more fields per your account schema
          });
        }
        return res.json({ ok: true, exported: rows.length });
      }
      case 'APPTIVO': {
        const { baseUrl } = (conn.metadata || {}) as any;
        if (!conn.apiKey || !baseUrl) throw new Error('Apptivo not connected');
        for (const r of rows) {
          await apptivoCreateLead(decrypt(conn.apiKey), conn.apiKey2 ? decrypt(conn.apiKey2) : undefined, baseUrl, {
            leadName: r[mapping.name],
            phone: r[mapping.contact],
            description: 'Imported from ZestLead',
            // add additional fields to match your Apptivo app
          });
        }
        return res.json({ ok: true, exported: rows.length });
      }
      default:
        return res.status(400).json({ error: `Provider ${provider} unsupported` });
    }
  } catch (e: any) {
    console.error('CRM export error:', e);
    return res.status(500).json({ error: e.message || 'Export failed' });
  }
}
