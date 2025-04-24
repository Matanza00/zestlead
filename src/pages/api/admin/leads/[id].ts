import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const lead = await prisma.lead.findUnique({
      where: { id: String(id) },
      include: {
        tags: true, // ✅ include tags in the response
      },
    });
    
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    return res.status(200).json(lead);
  }

  if (req.method === "PUT") {
    const data = req.body;
    const updated = await prisma.lead.update({
      where: { id: String(id) },
      data: data,
    });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
