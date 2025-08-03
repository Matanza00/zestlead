import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const { password, confirmPassword } = req.body;
  if (!password || password !== confirmPassword)
    return res.status(400).json({ error: 'Passwords do not match' });

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return res.status(200).json({ success: true });
}
