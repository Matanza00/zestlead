import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: String(id) },
      include: {
        user: true,
        lead: true
      }
    });

    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    return res.status(200).json(transaction);
  } catch (err) {
    console.error("Transaction fetch failed", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
