import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Escape a cell for CSV
function esc(v: any): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Array<Record<string, any>>, headers: { key: string; label: string }[]) {
  const head = headers.map(h => esc(h.label)).join(',');
  const body = rows.map(r => headers.map(h => esc(r[h.key])).join(',')).join('\n');
  return `${head}\n${body}\n`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions as any);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  // Accept either ?all=true (GET) or { all: true } / { leadIds: [] } (POST)
  const isAll =
    req.method === 'GET' ? req.query.all === 'true' : Boolean(req.body?.all);

  const leadIds: string[] =
    req.method === 'GET'
      ? Array.isArray(req.query.leadIds)
        ? req.query.leadIds
        : req.query.leadIds
        ? String(req.query.leadIds).split(',')
        : []
      : Array.isArray(req.body?.leadIds)
      ? req.body.leadIds
      : [];

  if (!isAll && leadIds.length === 0) {
    return res.status(400).json({ error: 'Provide leadIds or set all=true' });
  }

  // ✅ Select only fields that exist on your Lead model
  const purchases = await prisma.leadPurchase.findMany({
    where: {
      userId: session.user.id,
      ...(isAll ? {} : { leadId: { in: leadIds } }),
    },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
          contact: true,
          desireArea: true,
          propertyType: true,
          priceRange: true,
          price: true,
          leadType: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' }, // purchase time on LeadPurchase
  });

  // Shape rows for CSV (matching your UI fields)
  const rows = purchases.map((p) => ({
    leadId: p.lead?.id ?? '',
    name: p.lead?.name ?? '',
    contact: p.lead?.contact ?? '',
    desireArea: p.lead?.desireArea ?? '',
    propertyType: p.lead?.propertyType ?? '',
    priceRange: p.lead?.priceRange ?? '',
    price: p.lead?.price ?? '',
    leadType: p.lead?.leadType ?? '',
    purchasedAt: p.createdAt ? new Date(p.createdAt).toISOString() : '',
  }));

  const headers = [
    { key: 'leadId',       label: 'Lead ID' },
    { key: 'name',         label: 'Name' },
    { key: 'contact',      label: 'Contact' },
    { key: 'desireArea',   label: 'Area' },
    { key: 'propertyType', label: 'Property Type' },
    { key: 'priceRange',   label: 'Price Range' },
    { key: 'price',        label: 'Price' },
    { key: 'leadType',     label: 'Lead Type' },
    { key: 'purchasedAt',  label: 'Purchased At' },
  ];

  const csv = toCsv(rows, headers);
  const filename = `zestleads-my-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
}
