import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Tag name is required" });
  }

  try {
    const existing = await prisma.leadTag.findFirst({
      where: { name, leadId: String(id) },
    });

    if (existing) {
      return res.status(200).json({ success: true, message: "Tag already exists" });
    }

    const tag = await prisma.leadTag.create({
      data: {
        name,
        leadId: String(id),
      },
    });

    return res.status(201).json({ success: true, tag });
  } catch (err) {
    console.error("Tag creation failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
