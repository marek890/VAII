import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const sqlFile = "prisma/seed.sql";

const command = `PGUSER=${process.env.POSTGRES_USER} PGPASSWORD=${process.env.POSTGRES_PASSWORD} PGHOST=localhost PGPORT=5432 PGDATABASE=${process.env.POSTGRES_DB} psql -f ${sqlFile}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Chyba pri seedovaní: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Chyby SQL: ${stderr}`);
  }
  console.log(`Seed úspešne spustený:\n${stdout}`);
});
