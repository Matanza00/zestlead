// // pages/api/crm/oauth/hubspot/start.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { buildState } from '@/lib/oauth/state';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }

//   const session = await getServerSession(req, res, authOptions as any);
//   if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

//   const clientId    = process.env.HUBSPOT_CLIENT_ID!;
//   const redirectUri = process.env.HUBSPOT_REDIRECT_URI!;
//   const scopes = [
//     'crm.objects.contacts.read',
//     'crm.objects.contacts.write',
//     'oauth'
//   ].join(' ');

//   const state = buildState(session.user.id, 'HUBSPOT');
//   const u = new URL('https://app.hubspot.com/oauth/authorize');
//   u.searchParams.set('client_id', clientId);
//   u.searchParams.set('redirect_uri', redirectUri);
//   u.searchParams.set('scope', scopes);
//   u.searchParams.set('state', state);

//   res.redirect(u.toString());
// }
