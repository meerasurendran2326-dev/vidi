import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { Prisma } from "@prisma/client";

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server.");
  }

  return { client: new Razorpay({ key_id: keyId, key_secret: keySecret }), keyId };
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
): boolean {
  if (!/^[a-f\d]{64}$/i.test(signature)) return false;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay secret is not configured on the server.");

  const expected = createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest();
  const provided = Buffer.from(signature, "hex");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export function getAmountInPaise(amount: Prisma.Decimal): number {
  const paise = amount.mul(100);
  if (!paise.isInteger()) throw new Error("Order total has invalid paise precision.");
  const value = paise.toNumber();
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error("Order total is outside supported payment bounds.");
  }
  return value;
}
