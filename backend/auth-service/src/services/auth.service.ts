import bcrypt from "bcrypt";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

if (!USER_SERVICE_URL) {
    throw new Error("USER_SERVICE_URL is not defined");
}

if (!INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY is not defined");
}

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function verifyPassword(password: string, hash: string) {
    const isMatch = await comparePassword(password, hash);
    if (!isMatch) {
        throw new Error("Invalid password");
    }
}

export async function registerUser(userData: any) {
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

    // Strip password before returning
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

// hashPassword("password123").then(hash => console.log(hash));
// comparePassword("password123", "$2b$10$mSweGKwbH446ZBfbOkza5.o6SILphLF0FTkoIPliex6JhLRz1705.").then(result => console.log(result));