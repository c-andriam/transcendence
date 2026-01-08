import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const connectionString = `${process.env.RECIPE_DATABASE_URL}`;
const pool = new Pool({ connectionString, connectionTimeoutMillis: 2000 });
pool.on('connect', (client) => {
  client.query('SET search_path TO recipe_service');
});
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

export default db;
