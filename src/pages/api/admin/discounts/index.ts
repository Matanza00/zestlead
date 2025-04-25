import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const discounts = await prisma.discount.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
        include: {
          assignedUsers: true,
        },
      });
      return res.status(200).json(discounts);
    } catch (err) {
      console.error("Fetch discounts error:", err);
      return res.status(500).json({ error: "Failed to load discounts" });
    }
  }

  if (req.method === "POST") {
    const { code, description, percentage, expiresAt, maxUsage, stackable } = req.body;
  
    if (!code || typeof percentage !== "number") {
      return res.status(400).json({ error: "Code and percentage are required" });
    }
  
    try {
      // 1. Create Stripe Coupon
      const stripeCoupon = await stripe.coupons.create({
        percent_off: percentage,
        duration: "once",
      });
  
      // 2. Create Stripe Promotion Code
      const stripePromo = await stripe.promotionCodes.create({
        coupon: stripeCoupon.id,
        code: code.toUpperCase(), // Promo code user enters
        max_redemptions: maxUsage ? parseInt(maxUsage) : undefined,
        expires_at: expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : undefined,
      });
  
      // 3. Save everything in DB
      const newDiscount = await prisma.discount.create({
        data: {
          code,
          description: description || "",
          percentage,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
          maxUsage: maxUsage ? parseInt(maxUsage) : undefined,
          stackable: !!stackable,
          stripePromotionId: stripePromo.id, // ✅ This is what Stripe expects
        },
      });
  
      return res.status(201).json(newDiscount);
    } catch (err) {
      console.error("Create discount error:", err);
      return res.status(500).json({ error: "Failed to create discount" });
    }
  }
  

  return res.status(405).json({ error: "Method not allowed" });
}
