// pages/api/user/account/manage-subscription.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.email) return res.status(400).json({ error: 'Missing email' });

  // 🔄 Create Stripe customer portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer_email: user.email,
    return_url: `${req.headers.origin}/user/account`,
  });

  res.status(200).json({ url: portalSession.url });
}
