import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import speakeasy from "speakeasy";
import { prisma } from "@/lib/prisma"; // ✅ correct


export default async function handler(req, res) {
  const { token } = req.body;
  const session = await getServerSession(req, res, authOptions); // ✅ server-safe
  if (!session) return res.status(401).end();

  // 1. Fetch the user’s 2FA record
  const record = await prisma.twoFactorAuth.findUnique({
    where: { userId: session.user.id }
  });
  if (!record?.secret) {
    return res.status(400).json({ error: "2FA not initialized." });
  }

  // 2. Verify the TOTP code
  const isValid = speakeasy.totp.verify({
    secret: record.secret,
    encoding: "base32",
    token,
    window: 1
  });
  if (!isValid) return res.status(400).json({ error: "Invalid code." });

  // 3. Enable 2FA
  await prisma.twoFactorAuth.update({
    where: { userId: session.user.id },
    data: { enabled: true }
  });

  res.status(200).json({ success: true });
}
