import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const connectionString = process.env.USER_DATABASE_URL;

if (!connectionString) {
    throw new Error("USER_DATABASE_URL not found");
}

const pool = new Pool({ connectionString });
const dbUrl = new URL(connectionString);
const schema = dbUrl.searchParams.get('schema') || undefined;
const adapter = new PrismaPg(pool, { schema });
const prisma = new PrismaClient({ adapter });

async function main() {
    const username = process.argv[2];
    if (!username) {
        console.error("Please provide a username");
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { username },
            data: { role: 'ADMIN' }
        });
        console.log(`User ${user.username} promoted to ${user.role}`);
    } catch (e) {
        console.error("Error promoting user:", e);
        process.exit(1);
    }
}

main()
    .finally(async () => await prisma.$disconnect());
