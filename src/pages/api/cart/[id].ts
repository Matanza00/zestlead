// pages/api/cart/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";           // ← server helper
import { authOptions }     from "@/lib/auth";               // ← your authOptions
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.setHeader("Allow", ["DELETE"]).status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  const userId = session.user.id as string;
  const { id } = req.query;

  await prisma.cartItem.deleteMany({
    where: { id: String(id), userId },
  });
  return res.status(204).end();
}
