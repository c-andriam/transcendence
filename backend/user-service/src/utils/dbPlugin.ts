// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});
// const connectionString = `${process.env.DATABASE_URL}`;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);

const dbUrl = new URL(process.env.USER_DATABASE_URL!);
const schema = dbUrl.searchParams.get('schema');
const pool = new Pool({ connectionString: process.env.USER_DATABASE_URL });
const adapter = new PrismaPg(pool, { schema });

const db = new PrismaClient({ adapter });

export default db;
