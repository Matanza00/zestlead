// /pages/api/admin/users/index.ts
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const roleParam = req.query.role?.toString().toUpperCase();

    if (!roleParam || !["ADMIN", "AGENT"].includes(roleParam)) {
      return res.status(400).json({ message: "Invalid or missing role parameter." });
    }

    const users = await prisma.user.findMany({
      where: { role: roleParam },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ users });
  } catch (err) {
    console.error("User API Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
