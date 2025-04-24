import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { leadIds, tag } = req.body;

  if (!Array.isArray(leadIds) || typeof tag !== "string" || !tag.trim()) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const tagResults = await Promise.all(
      leadIds.map(async (leadId) => {
        const exists = await prisma.leadTag.findFirst({
          where: { leadId, name: tag },
        });

        if (exists) return exists;

        return await prisma.leadTag.create({
          data: {
            name: tag,
            leadId,
          },
        });
      })
    );

    return res.status(200).json({ success: true, appliedTo: tagResults.length });
  } catch (err) {
    console.error("Bulk tag error:", err);
    return res.status(500).json({ error: "Failed to apply tag" });
  }
}
