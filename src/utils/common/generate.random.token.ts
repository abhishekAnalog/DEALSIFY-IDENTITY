// src/utils/token.util.ts
import { randomBytes } from 'crypto';

export function generateRandomToken(length: number = 40): string {
    return randomBytes(length).toString('hex');
}
