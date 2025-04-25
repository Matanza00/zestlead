// pages/api/2fa/status.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma"; // ✅ correct


export default async function handler(req, res) {
  
  const session = await getServerSession(req, res, authOptions); // ✅ server-safe
  if (!session) return res.status(401).end();
  const record = await prisma.twoFactorAuth.findUnique({
    where: { userId: session.user.id },
  });
  res.status(200).json({ enabled: record?.enabled ?? false });
}
