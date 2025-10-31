// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { buildState } from '@/lib/oauth/state';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }

//   const session = await getServerSession(req, res, authOptions as any);
//   if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

//   const base = (process.env.SF_LOGIN_BASE || 'https://login.salesforce.com').replace(/\/+$/,'');
//   const clientId = process.env.SF_CLIENT_ID!;
//   const redirectUri = process.env.SF_REDIRECT_URI!;
//   const state = buildState(session.user.id, 'SALESFORCE');
//   // Minimal scopes for API + refresh:
//   const scopes = ['api', 'refresh_token'].join(' ');

//   const u = new URL(`${base}/services/oauth2/authorize`);
//   u.searchParams.set('response_type', 'code');
//   u.searchParams.set('client_id', clientId);
//   u.searchParams.set('redirect_uri', redirectUri);
//   u.searchParams.set('scope', scopes);
//   u.searchParams.set('state', state);

//   res.redirect(u.toString());
// }
