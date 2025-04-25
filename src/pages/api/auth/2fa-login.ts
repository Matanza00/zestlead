// pages/api/auth/2fa-login.ts
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import speakeasy from 'speakeasy';

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) return res.status(401).json({ error: 'Not authenticated' });

  const { code } = req.body;

  const record = await prisma.twoFactorAuth.findUnique({
    where: { userId: token.id },
  });

  if (!record?.secret) return res.status(400).json({ error: '2FA not set up' });

  const verified = speakeasy.totp.verify({
    secret: record.secret,
    encoding: 'base32',
    token: code,
  });

  if (!verified) return res.status(400).json({ error: 'Invalid code' });

  // 2FA success — session logic here is simple due to JWT
  // Optionally reissue token or invalidate `twoFactorPending` via middleware

  res.status(200).json({ success: true });
}
