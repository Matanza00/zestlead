// pages/api/cart/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";           // ← server helper
import { authOptions }     from "@/lib/auth";               // ← your authOptions
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  const userId = session.user.id as string;

  if (req.method === "GET") {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { lead: { select: { id: true, name: true, price: true, propertyType: true } } },
    });
    return res.json(items);
  }

  if (req.method === "POST") {
    const { leadId } = req.body;
    const item = await prisma.cartItem.create({
      data: { userId, leadId },
      include: { lead: true },
    });
    return res.status(201).json(item);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
