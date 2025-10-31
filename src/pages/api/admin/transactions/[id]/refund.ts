// pages/api/admin/transactions/[id]/refund.ts
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { id } = req.query;

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id: String(id) } });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    const refund = await stripe.refunds.create({
      payment_intent: transaction.reference,
    });

    await prisma.transaction.update({
      where: { id: String(id) },
      data: { status: "REFUNDED" },
    });

    res.status(200).json({ success: true, refund });
  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ error: "Refund failed" });
  }
}
