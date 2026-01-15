"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../.env"),
});
const connectionString = process.env.USER_DATABASE_URL;
if (!connectionString) {
    throw new Error("USER_DATABASE_URL not found");
}
const pool = new pg_1.Pool({ connectionString });
const dbUrl = new URL(connectionString);
const schema = dbUrl.searchParams.get('schema') || undefined;
const adapter = new adapter_pg_1.PrismaPg(pool, { schema });
const prisma = new prisma_1.PrismaClient({ adapter });
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
    }
    catch (e) {
        console.error("Error promoting user:", e);
        process.exit(1);
    }
}
main()
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=promoteAdmin.js.map