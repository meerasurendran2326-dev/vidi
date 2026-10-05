import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const SESSION_COOKIE_NAME = "vvv_session_token";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Derives a secure password hash using scrypt with random salt.
 * Formatted as: salt:key
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/**
 * Timing-safe verification of password against stored scrypt hash.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;

  const expectedKey = Buffer.from(keyHex, "hex");
  const derived = (await scryptAsync(password, salt, expectedKey.length)) as Buffer;

  if (derived.length !== expectedKey.length) {
    return false;
  }
  return timingSafeEqual(derived, expectedKey);
}

/**
 * Hashes raw session tokens with SHA-256 and server-side secret
 * so database compromise does not reveal raw session tokens.
 */
export function hashSessionToken(rawToken: string): string {
  const secret = process.env.AUTH_SECRET || "vvv_atelier_fallback_auth_salt";
  return createHash("sha256")
    .update(`${rawToken}:${secret}`)
    .digest("hex");
}
