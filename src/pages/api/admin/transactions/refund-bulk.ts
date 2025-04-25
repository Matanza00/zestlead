// pages/api/admin/transactions/refund-bulk.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { transactionIds } = req.body;

  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    return res.status(400).json({ error: "Invalid or missing transaction IDs" });
  }

  try {
    const updated = await prisma.transaction.updateMany({
      where: {
        id: { in: transactionIds },
        status: "SUCCESS", // Only allow refund of successful transactions
      },
      data: {
        status: "REFUNDED",
      },
    });

    return res.status(200).json({ success: true, count: updated.count });
  } catch (err) {
    console.error("Bulk refund failed:", err);
    return res.status(500).json({ error: "Refund processing failed" });
  }
}
