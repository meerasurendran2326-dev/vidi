import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export function isValidOrderId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{10,64}$/.test(value);
}

export function orderAccessCookieName(orderId: string): string {
  return `vvv_order_access_${orderId}`;
}

export async function getOrderAccessToken(
  orderId: string,
  request: Request,
): Promise<string | null> {
  if (!isValidOrderId(orderId)) return null;
  const authorization = request.headers.get("authorization") ?? "";
  const bearer = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization)?.[1];
  if (bearer) return bearer;

  const cookieStore = await cookies();
  return cookieStore.get(orderAccessCookieName(orderId))?.value ?? null;
}

export function createOrderAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOrderAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function orderAccessTokenMatches(
  token: string,
  expectedHash: string,
): boolean {
  const provided = Buffer.from(hashOrderAccessToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
