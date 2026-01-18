import { readFile } from "fs/promises";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const sqlFile = "prisma/seed.sql";

async function seedDatabase() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: "localhost",
    port: 5432,
    database: process.env.POSTGRES_DB,
  });

  try {
    await client.connect();
    const sql = await readFile(sqlFile, "utf8");
    await client.query(sql);
    console.log("Seed úspešne spustený!");
  } catch (err) {
    console.error("Chyba pri seedovaní:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase();
