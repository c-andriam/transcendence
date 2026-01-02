import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../error';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(
    plainTextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
}

export async function verifyPassword(
    plain: string,
    hashed: string
): Promise<void> {
    const isMatch = await comparePassword(plain, hashed);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid password');
    }
}