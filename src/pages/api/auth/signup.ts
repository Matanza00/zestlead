// pages/api/auth/signup.ts
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { name, email, password, referralCode } = req.body as {
      name: string;
      email: string;
      password: string;
      referralCode?: string;
    };

    // Basic guard
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Already exists?
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await hash(password, 10);

    // Look up referrer (if any)
    let referrer: { id: string } | null = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true },
      });
    }

    // Create user (attach referredById if found)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "AGENT",
        referredById: referrer?.id ?? null, // <-- important
      },
      select: { id: true, email: true, name: true },
    });

    // If referrer exists and it's not a self-ref (paranoia), create/upsert a Referral row
    if (referrer && referrer.id !== user.id) {
      await prisma.referral.upsert({
        where: {
          // unique composite: @@unique([referrerId, referredEmail]) in schema
          referrerId_referredEmail: {
            referrerId: referrer.id,
            referredEmail: user.email,
          },
        },
        update: {
          referredUserId: user.id,
          status: "SIGNED_UP",
        },
        create: {
          referrerId: referrer.id,
          referredEmail: user.email,
          referredUserId: user.id,
          status: "SIGNED_UP",
        },
      });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || "",
    });

    // Update the user with stripeCustomerId
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Signup error:", err);
    // Handle unique constraint violations gracefully (e.g., referral uniques)
    if (err.code === "P2002") {
      return res.status(400).json({ error: "A unique field already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
