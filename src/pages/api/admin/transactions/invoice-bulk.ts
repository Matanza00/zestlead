// pages/api/admin/transactions/invoice-bulk.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { transactionIds } = req.body;

  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    return res.status(400).json({ error: "Invalid or missing transaction IDs" });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { id: { in: transactionIds } },
      include: {
        user: true,
      },
    });

    // Simulate invoice generation
    const invoices = transactions.map(tx => ({
      transactionId: tx.id,
      user: tx.user,
      amount: tx.amount,
      status: tx.status,
      date: tx.createdAt,
      reference: tx.reference,
    }));

    return res.status(200).json({ invoices });
  } catch (err) {
    console.error("Bulk invoice generation failed:", err);
    return res.status(500).json({ error: "Invoice generation failed" });
  }
}
