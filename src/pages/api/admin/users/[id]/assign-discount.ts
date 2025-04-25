import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { discountId } = req.body;
    if (!discountId) return res.status(400).json({ error: "Missing discountId" });

    try {
        const assigned = await prisma.discountAssignment.create({
            data: {
              discountId,
              userId: String(id),
            },
            include: {
              discount: true, // ✅ Make sure this line exists if needed for frontend display
            },
          });
          
          return res.status(201).json({ success: true, assigned });
          
    } catch (err) {
      console.error("Failed to assign discount", err);
      return res.status(500).json({ error: "Failed to assign discount" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
