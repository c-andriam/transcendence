import bcrypt from "bcrypt";

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

    const url = process.env.USER_SERVICE_URL;
    const path = "/api/v1/users";
    const response = await fetch(`${url}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': process.env.INTERNAL_API_KEY || ''
        },
        body: JSON.stringify(userToCreate)
    });
    return await response.json();
}

export async function loginUser(credentials: any) {
    const { identifier, password } = credentials;
    const url = process.env.USER_SERVICE_URL;
    const response = await fetch(`${url}/api/v1/internal/users/by-identifier/${identifier}`, {
        headers: {
            'x-internal-api-key': process.env.INTERNAL_API_KEY || ''
        }
    });
    const result = await response.json();

    if (result.status === 'error') {
        throw new Error(result.message || "User not found");
    }

    const user = result.data;
    await verifyPassword(password, user.password);
    return user;
}

// hashPassword("password123").then(hash => console.log(hash));
// comparePassword("password123", "$2b$10$mSweGKwbH446ZBfbOkza5.o6SILphLF0FTkoIPliex6JhLRz1705.").then(result => console.log(result));