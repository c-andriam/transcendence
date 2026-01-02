import { hashPassword, comparePassword, verifyPassword, isValidEmail } from "@transcendence/common";
import { BadRequestError } from "@transcendence/common";

const DOMAIN = process.env.DOMAIN;
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
const USER_SERVICE_URL = `${DOMAIN}:${USER_SERVICE_PORT}`;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;


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
    const hashedPassword = await hashPassword(userData.password);
    const userToCreate = {
        ...userData,
        password: hashedPassword
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
    return userWithoutPassword;
}