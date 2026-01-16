import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding roles...");

  await prisma.role.createMany({
    data: [
      { role_name: "admin" },
      { role_name: "mechanic" },
      { role_name: "customer" },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding users...");

  await prisma.user.createMany({
    data: [
      {
        first_name: "Admin",
        last_name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        phone: "0900000000",
        role_id: 1,
      },
      {
        first_name: "Jan",
        last_name: "Mechanik",
        email: "mechanik@example.com",
        password: "mechanik123",
        phone: "0911000000",
        role_id: 2,
      },
      {
        first_name: "Peter",
        last_name: "Zakaznik",
        email: "zakaznik@example.com",
        password: "zakaznik123",
        phone: "0911222333",
        role_id: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
