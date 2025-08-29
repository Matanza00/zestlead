// pages/api/user/account/change-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // auth
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = session.user.id as string;

  const { newPassword, confirmPassword } = req.body;
  if (typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
    return res.status(400).json({ error: 'Missing passwords' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Failed to change password' });
  }
}
