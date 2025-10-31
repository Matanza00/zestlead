const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  const users = await prisma.user.findMany({
    where: { stripeCustomerId: null },
  });

  console.log(`🔍 Found ${users.length} users without Stripe customer ID.`);

  for (const user of users) {
    try {
      if (!user.email) continue;

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });

      console.log(`✅ Linked Stripe customer to user: ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to create customer for ${user.email}:`, err);
    }
  }

  await prisma.$disconnect();
}

main();
