import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma"; // ✅ correct


export default async function handler(req, res) {
  
  const session = await getServerSession(req, res, authOptions); // ✅ server-safe
  if (!session) return res.status(401).end();

  // 1. Generate a new TOTP secret
  const secret = speakeasy.generateSecret({
    name: `ZestLeads (${session.user.email})`
  });

  // 2. Upsert into TwoFactorAuth
  await prisma.twoFactorAuth.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      secret: secret.base32,
      enabled: false
    },
    update: { secret: secret.base32 }
  });

  // 3. Return QR code data URL
  const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url!);
  res.status(200).json({ qr: qrDataUrl });
}
