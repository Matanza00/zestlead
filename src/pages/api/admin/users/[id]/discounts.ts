import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const assigned = await prisma.discountAssignment.findMany({
        where: { userId: String(id) },
        include: { discount: true },
        orderBy: { assignedAt: "desc" }
      });
      return res.status(200).json(assigned);
    } catch (err) {
      console.error("Failed to fetch user discounts", err);
      return res.status(500).json({ error: "Failed to fetch discounts" });
    }
  }
  if (req.method === "DELETE") {
    const { assignmentId } = req.query;
  
    if (!assignmentId) {
      return res.status(400).json({ error: "Missing assignmentId" });
    }
  
    try {
      await prisma.discountAssignment.delete({
        where: { id: String(assignmentId) }
      });
  
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Failed to delete discount assignment:", err);
      return res.status(500).json({ error: "Failed to remove assignment" });
    }
  }
  

  return res.status(405).json({ error: "Method not allowed" });
}
