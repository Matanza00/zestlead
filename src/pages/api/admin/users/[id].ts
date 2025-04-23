import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        deletedAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  }

  if (req.method === "PUT") {
    const { action } = req.body;
    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: {
        deletedAt: action === "suspend" ? new Date() : null,
      },
    });
    return res.status(200).json({ success: true, user: updated });
  }

  if (req.method === "PATCH") {
    const { name, email } = req.body;
    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: { name, email },
    });
    return res.status(200).json(updated);
  }
  

  return res.status(405).json({ error: "Method not allowed" });
}
