import db from "../utils/dbPlugin";

export async function createUser(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
}) {
    const user = await db.user.create({
        data: { ...data }
    });
    return user;
}

export async function getAllUsers() {
    const users = await db.user.findMany();
    return users;
}

export async function getUserById(id: string) {
    const user = await db.user.findUnique({ where: { id } });
    return user;
}

export async function updateUser(id: string, data: {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
}) {
    const user = await db.user.update({
        where: { id },
        data: { ...data }
    });
    return user;
}

export async function deleteUser(id: string) {
    const user = await db.user.delete({ where: { id } });
    return user;
}

export async function getUsersByIds(ids: string[]) {
    const users = await db.user.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            username: true,
            avatarUrl: true
        }
    });
    return users;
}