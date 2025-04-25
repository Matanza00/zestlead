// pages/api/admin/transactions/[id]/invoice.ts
import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const { id } = req.query;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id as string);
    const charges = paymentIntent?.charges?.data;

    if (!charges?.length) return res.status(404).json({ error: "No charge found" });

    const receiptUrl = charges[0].receipt_url;
    res.status(200).json({ receiptUrl });
  } catch (err) {
    console.error("Invoice fetch error:", err);
    res.status(500).json({ error: "Unable to fetch invoice" });
  }
}
