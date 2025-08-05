// pages/api/admin/leads/[id].ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  switch (req.method) {
    // READ a single lead (with tags)
    case "GET": {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: { tags: true },
      });
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      return res.status(200).json(lead);
    }

    // UPDATE a lead
    case "PUT": {
      try {
        const updated = await prisma.lead.update({
          where: { id },
          data: req.body,
        });
        return res.status(200).json(updated);
      } catch (err) {
        console.error('Lead update failed:', err);
        return res.status(400).json({ error: 'Invalid update data' });
      }
    }

    // SOFT DELETE a lead
    case "DELETE": {
      try {
        await prisma.lead.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error('Lead deletion failed:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}