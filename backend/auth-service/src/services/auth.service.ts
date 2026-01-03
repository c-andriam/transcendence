import { hashPassword, comparePassword, verifyPassword, isValidEmail } from "@transcendence/common";
import { BadRequestError } from "@transcendence/common";
// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../generated/prisma";
import { randomBytes, createHash } from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const DOMAIN = process.env.DOMAIN;
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
const USER_SERVICE_URL = `${DOMAIN}:${USER_SERVICE_PORT}`;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const dbUrl = new URL(process.env.DATABASE_URL);
const schema = dbUrl.searchParams.get('schema') || 'public';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: new PrismaPg(pool, { schema }),
});

if (!USER_SERVICE_URL) {
    throw new Error("USER_SERVICE_URL is not defined");
}

if (!INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY is not defined");
}

export async function registerUser(userData: any) {
    const isSafeEmail = await isValidEmail(userData.email);
    if (!isSafeEmail) {
        throw new BadRequestError("Invalid email or email address doesn't exist");
    }
    const userToCreate = {
        ...userData,
    };

    const path = "/api/v1/users";
    const response = await fetch(`${USER_SERVICE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': INTERNAL_API_KEY
        },
        body: JSON.stringify(userToCreate)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to register user");
    }

    if (result.data && result.data.password) {
        const { password: _, ...userWithoutPassword } = result.data;
        result.data = userWithoutPassword;
    }

    return result;
}

export async function loginUser(credentials: any) {
    const { identifier, password } = credentials;
    const response = await fetch(`${USER_SERVICE_URL}/api/v1/internal/users/by-identifier/${identifier}`, {
        headers: {
            'x-internal-api-key': INTERNAL_API_KEY
        }
    });
    const result = await response.json();

    if (result.status === 'error') {
        throw new Error(result.message || "User not found");
    }

    const user = result.data;
    await verifyPassword(password, user.password);

    const { password: _, ...userWithoutPassword } = user;
    const refreshToken = await createRefreshToken(user.id, user.username);
    return { ...userWithoutPassword, refreshToken };
}

export async function createRefreshToken(userId: string, username: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
        data: { token: hashedToken, userId, username, expiresAt }
    });
    return token;
}

export async function refreshAccessToken(refreshToken: string): Promise<{userId: string; username: string; refreshToken: string}> {
    const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
    const storedToken = await prisma.refreshToken.findUnique({ where: { token: hashedToken } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new BadRequestError('Invalid or expired refresh token');
    }
    await prisma.refreshToken.delete({ where: { token: hashedToken } });
    const newRefreshToken = await createRefreshToken(storedToken.userId, storedToken.username);
    return { userId: storedToken.userId, username: storedToken.username, refreshToken: newRefreshToken };
}

export async function deleteRefreshToken(refreshToken: string): Promise<void> {
    const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
    await prisma.refreshToken.delete({ where: { token: hashedToken } });
}