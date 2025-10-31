// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { buildState } from '@/lib/oauth/state';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }

//   const session = await getServerSession(req, res, authOptions as any);
//   if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

//   const clientId = process.env.ZOHO_CLIENT_ID!;
//   const redirectUri = process.env.ZOHO_REDIRECT_URI!;
//   const accountsBase = (process.env.ZOHO_ACCOUNTS_BASE || 'https://accounts.zoho.com').replace(/\/+$/,'');
//   // Minimum scopes for Leads create/read; adjust per needs:
//   const scopes = [
//     'ZohoCRM.modules.leads.ALL',
//     'ZohoCRM.users.ALL',
//     'ZohoCRM.org.READ'
//   ].join(',');

//   const state = buildState(session.user.id, 'ZOHO');
//   const u = new URL(`${accountsBase}/oauth/v2/auth`);
//   u.searchParams.set('client_id', clientId);
//   u.searchParams.set('redirect_uri', redirectUri);
//   u.searchParams.set('response_type', 'code');
//   u.searchParams.set('scope', scopes);
//   u.searchParams.set('access_type', 'offline'); // refresh_token
//   u.searchParams.set('prompt', 'consent');      // ensure refresh_token
//   u.searchParams.set('state', state);

//   res.redirect(u.toString());
// }
