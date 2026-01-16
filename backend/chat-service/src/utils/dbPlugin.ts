import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

const connectionString = process.env.CHAT_DATABASE_URL;

if (!connectionString) {
    throw new Error("CHAT_DATABASE_URL is not defined in environment variables");
}

const dbUrl = new URL(connectionString);
const schema = dbUrl.searchParams.get('schema') || undefined;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool, { schema });
const db = new PrismaClient({ adapter });

export default db;
