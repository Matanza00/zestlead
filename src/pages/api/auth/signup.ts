import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already in use" });

  const hashed = await hash(password, 10);

  // ✅ Create user first and store the result
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "AGENT" },
  });

  // ✅ Now create Stripe customer using user data
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || "",
  });

  // ✅ Update the user with stripeCustomerId
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  res.status(200).json({ success: true });
}
