// api/admin/discounts/index.ts
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
    const {
      code,
      description,
      percentage,
      maxCap,       // ← new
      expiresAt,
      maxUsage,
      stackable,
    } = req.body;

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
        code: code.toUpperCase(),
        max_redemptions: maxUsage,
        expires_at: expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : undefined,
      });

      // 3. Save in DB (including maxCap)
      const newDiscount = await prisma.discount.create({
        data: {
          code: code.toUpperCase(),
          description: description || "",
          percentage,
          maxCap: typeof maxCap === "number"
            ? maxCap
            : maxCap != null
              ? parseFloat(maxCap)
              : undefined,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
          maxUsage: typeof maxUsage === "number" ? maxUsage : maxUsage ? parseInt(maxUsage) : undefined,
          stackable: !!stackable,
          stripePromotionId: stripePromo.id,
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
