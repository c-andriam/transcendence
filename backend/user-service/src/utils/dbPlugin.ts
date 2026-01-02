import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

console.log('[dbPlugin] Keys on db instance:', Object.keys(db));
// @ts-ignore
console.log('[dbPlugin] db.user exists?', !!db.user);

export default db;
