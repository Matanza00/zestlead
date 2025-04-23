import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma"; 
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already in use" });

  const hashed = await hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed, role: "AGENT" },
  });

  res.status(200).json({ success: true });
}
