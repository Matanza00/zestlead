const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@zestleads.com";

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log("✅ Admin already exists. Skipping...");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.create({
    data: {
      name: "Zest User",
      email: "user@yopmail.com",
      password: hashedPassword,
      role: "AGENT",
    },
  });
  await prisma.user.create({
    data: {
      name: "Zest Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  await prisma.user.create({
    data: {
      name: "System Owner",
      email: "superAdmin@yopmail.com",
      password: hashedPassword,
      role: "SUPER_ADMIN"
    }
  });
  

  console.log("✅ Admin user created successfully.");
}

main()
  .catch((err) => {
    console.error("❌ Failed to seed admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
