import assert from "node:assert/strict";
import test from "node:test";
import { createOrderSchema } from "@/app/lib/order-validation";

const validRequest = {
  customer: {
    fullName: "Asha Patel",
    email: "asha@example.com",
    phone: "+91 9876543210",
  },
  shippingAddress: {
    addressLine1: "12 Silver Street",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400001",
    country: "India",
  },
  items: [
    {
      productId: "ring-1",
      quantity: 2,
      selectedVariant: { Size: "M" },
    },
  ],
};

test("accepts customer, shipping, product IDs, quantities, and selected variants", () => {
  assert.equal(createOrderSchema.safeParse(validRequest).success, true);
});

test("rejects client-supplied totals", () => {
  assert.equal(
    createOrderSchema.safeParse({ ...validRequest, total: 1 }).success,
    false,
  );
});

test("rejects client-supplied item prices", () => {
  assert.equal(
    createOrderSchema.safeParse({
      ...validRequest,
      items: [{ ...validRequest.items[0], price: "1.00" }],
    }).success,
    false,
  );
});

test("rejects invalid address postal codes and non-positive quantities", () => {
  const invalidPostal = {
    ...validRequest,
    shippingAddress: { ...validRequest.shippingAddress, pinCode: "12345" },
  };
  const invalidQuantity = {
    ...validRequest,
    items: [{ ...validRequest.items[0], quantity: 0 }],
  };
  assert.equal(createOrderSchema.safeParse(invalidPostal).success, false);
  assert.equal(createOrderSchema.safeParse(invalidQuantity).success, false);
});
