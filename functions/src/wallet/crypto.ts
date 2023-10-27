import * as crypto from 'crypto';

function createHash(keyString: string) {
    return crypto.createHash('sha256').update(keyString).digest();
}

// Function to encrypt text using AES-256-GCM
export function encrypt(text: string, keyString: string): string {
    const key = createHash(keyString);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

// Function to decrypt encrypted text using AES-256-GCM
// export function decrypt(encryptedText: string, keyString: string): string {
//     const key = createHash(keyString);
//     const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
//     const iv = Buffer.from(ivHex, 'hex');
//     const authTag = Buffer.from(authTagHex, 'hex');
//     const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
//     decipher.setAuthTag(authTag);
//     let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }
