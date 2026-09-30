import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");

  await prisma.adminUser.upsert({
    where: { email },
    update: { name: "JMD Admin", passwordHash: password },
    create: { name: "JMD Admin", email, passwordHash: password, role: "ADMIN" }
  });

  console.log("JMD admin created/updated:", email);
}

main().finally(() => prisma.$disconnect());
