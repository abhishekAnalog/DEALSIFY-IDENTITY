export class RandomStringService {
    generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        // Using Array.from and map to build the random string
        const randomString = Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');

        return randomString;
    }
}