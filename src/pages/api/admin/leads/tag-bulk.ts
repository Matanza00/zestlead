// pages/api/admin/leads/tag-bulk.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { leadIds, tag } = req.body as { leadIds: string[]; tag: string };
  if (!Array.isArray(leadIds) || typeof tag !== "string" || !tag.trim()) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  try {
    const results = await Promise.all(
      leadIds.map(leadId =>
        prisma.leadTag.upsert({
          where: { leadId_name: { leadId, name: tag } },
          update: {},
          create: { leadId, name: tag },
        })
      )
    );
    return res.status(200).json({ success: true, appliedTo: results.length });
  } catch (err) {
    console.error('Bulk tag error:', err);
    return res.status(500).json({ error: 'Failed to apply tag' });
  }
}