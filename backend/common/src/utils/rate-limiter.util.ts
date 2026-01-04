export class RateLimiter {
    private store = new Map<string, number[]>();

    constructor(
        private max: number,
        private timeWindowMs: number
    ) { }

    /**
     * Checks if the key is currently rate limited.
     * @param key The identifier to check (e.g., username, email, or IP)
     * @returns true if the limit is reached, false otherwise
     */
    isRateLimited(key: string): boolean {
        this.cleanup(key);
        const attempts = this.store.get(key) || [];
        return attempts.length >= this.max;
    }

    /**
     * Records a failed attempt for the key.
     * @param key The identifier to record the attempt for
     */
    recordAttempt(key: string): void {
        this.cleanup(key);
        const attempts = this.store.get(key) || [];
        attempts.push(Date.now());
        this.store.set(key, attempts);
    }

    /**
     * Resets the attempts for the key (e.g., after a successful login).
     * @param key The identifier to reset
     */
    reset(key: string): void {
        this.store.delete(key);
    }

    /**
     * Removes expired timestamps from the store for a given key.
     */
    private cleanup(key: string): void {
        const now = Date.now();
        const attempts = this.store.get(key);
        if (attempts) {
            const validAttempts = attempts.filter(ts => now - ts < this.timeWindowMs);
            if (validAttempts.length === 0) {
                this.store.delete(key);
            } else {
                this.store.set(key, validAttempts);
            }
        }
    }
}

/**
 * Pre-configured rate limiter for password verification:
 * 3 attempts allowed within a 1-minute window.
 */
export const passwordRateLimiter = new RateLimiter(3, 60000);