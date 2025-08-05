import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: leadId } = req.query as { id: string };

  switch (req.method) {
    // LIST all tags for this lead
    case "GET": {
      const tags = await prisma.leadTag.findMany({
        where: { leadId },
        orderBy: { name: "asc" },
      });
      return res.status(200).json(tags);
    }

    // CREATE a new tag
    case "POST": {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Tag name is required" });
      }

      // avoid duplicates
      const existing = await prisma.leadTag.findFirst({
        where: { leadId, name: { equals: name } },
      });
      if (existing) {
        return res
          .status(200)
          .json({ success: true, message: "Tag already exists", tag: existing });
      }

      const tag = await prisma.leadTag.create({
        data: { leadId, name },
      });
      return res.status(201).json({ success: true, tag });
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
