import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { leadIds, price } = req.body;

  if (!Array.isArray(leadIds) || typeof price !== "number") {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const updated = await Promise.all(
      leadIds.map(id =>
        prisma.lead.update({
          where: { id },
          data: { price },
        })
      )
    );

    return res.status(200).json({ success: true, updatedCount: updated.length });
  } catch (err) {
    console.error("Bulk price update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
