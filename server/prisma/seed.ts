import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { name: "JMD Admin", passwordHash, role: "ADMIN" },
    create: { name: "JMD Admin", email, passwordHash, role: "ADMIN" }
  });
  console.log("JMD admin created/updated:", email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
