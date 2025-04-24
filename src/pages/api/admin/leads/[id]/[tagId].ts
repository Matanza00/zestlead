import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tagId } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await prisma.leadTag.delete({
      where: { id: String(tagId) },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Tag deletion failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
