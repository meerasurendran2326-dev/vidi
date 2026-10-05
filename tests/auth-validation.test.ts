import assert from "node:assert/strict";
import test from "node:test";
import { loginSchema, signUpSchema } from "../app/lib/auth-validation";
import {
  hashPassword,
  hashSessionToken,
  verifyPassword,
} from "../app/lib/auth-crypto";

test("signUpSchema accepts valid customer registration data", () => {
  const result = signUpSchema.safeParse({
    fullName: "Empress Aurelia",
    email: "aurelia@atelier.com",
    phone: "+91 9876543210",
    password: "Password123",
  });
  assert.equal(result.success, true);
});

test("signUpSchema rejects weak passwords lacking numbers", () => {
  const result = signUpSchema.safeParse({
    fullName: "Empress Aurelia",
    email: "aurelia@atelier.com",
    password: "onlylettershere",
  });
  assert.equal(result.success, false);
});

test("signUpSchema rejects short passwords under 8 characters", () => {
  const result = signUpSchema.safeParse({
    fullName: "Empress Aurelia",
    email: "aurelia@atelier.com",
    password: "Pass1",
  });
  assert.equal(result.success, false);
});

test("loginSchema accepts valid email and password", () => {
  const result = loginSchema.safeParse({
    email: "client@vini-vici-vidi.com",
    password: "SecretPassword1",
  });
  assert.equal(result.success, true);
});

test("hashPassword produces salted scrypt hash and verifyPassword matches correctly", async () => {
  const password = "AtelierLuxurySilver2026";
  const hashed = await hashPassword(password);

  assert.ok(hashed.includes(":"), "Hash must contain salt separator");
  const isValid = await verifyPassword(password, hashed);
  assert.equal(isValid, true, "Valid password must verify as true");

  const isInvalid = await verifyPassword("WrongPassword", hashed);
  assert.equal(isInvalid, false, "Wrong password must verify as false");
});

test("hashSessionToken generates consistent deterministic sha256 output", () => {
  const token = "token_abc_123_456";
  const hash1 = hashSessionToken(token);
  const hash2 = hashSessionToken(token);

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});
