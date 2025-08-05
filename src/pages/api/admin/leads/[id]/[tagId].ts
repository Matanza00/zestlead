import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tagId } = req.query as { tagId: string };

  switch (req.method) {
    // UPDATE tag name
    case "PUT": {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "New tag name is required" });
      }

      try {
        const updated = await prisma.leadTag.update({
          where: { id: tagId },
          data: { name },
        });
        return res.status(200).json({ success: true, tag: updated });
      } catch (err) {
        console.error("Tag update failed:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    // DELETE the tag
    case "DELETE": {
      try {
        await prisma.leadTag.delete({ where: { id: tagId } });
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error("Tag deletion failed:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
