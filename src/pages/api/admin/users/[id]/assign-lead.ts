import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { leadId, note } = req.body;

    try {
      const assigned = await prisma.assignedLead.create({
        data: {
          userId: String(id),
          leadId,
          note: note || "",
        },
      });

      return res.status(201).json({ success: true, assigned });
    } catch (err) {
      console.error("Assign error:", err);
      return res.status(500).json({ error: "Failed to assign lead" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
