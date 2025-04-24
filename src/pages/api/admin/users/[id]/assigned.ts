import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const assignments = await prisma.assignedLead.findMany({
        where: { userId: String(id) },
        orderBy: { assignedAt: "desc" },
        include: { lead: true },
      });
      return res.status(200).json(assignments);
    } catch (error) {
      console.error("Error fetching assigned leads:", error);
      return res.status(500).json({ error: "Failed to fetch assigned leads" });
    }
  }

  if (req.method === "DELETE") {
    const { assignedId } = req.body;
    if (!assignedId) return res.status(400).json({ error: "Missing assignedId" });
  
    try {
      const deleted = await prisma.assignedLead.delete({
        where: { id: String(assignedId) },
      });
      return res.status(200).json({ success: true, deleted });
    } catch (err) {
      console.error("Unassign error:", err);
      return res.status(500).json({ error: "Failed to unassign lead" });
    }
  }
  

  return res.status(405).json({ error: "Method not allowed" });
}
