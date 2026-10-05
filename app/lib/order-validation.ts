import { z } from "zod";

const customerSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
    phone: z
      .string()
      .trim()
      .max(24)
      .refine((phone) => {
        const digits = phone.replace(/\D/g, "");
        return /^\+?[\d\s().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
      }, "Enter a valid phone number."),
  })
  .strict();

const shippingAddressSchema = z
  .object({
    addressLine1: z.string().trim().min(3).max(180),
    addressLine2: z.string().trim().max(180).optional().default(""),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    pinCode: z.string().trim().min(3).max(12),
    country: z.string().trim().min(2).max(80),
  })
  .strict()
  .superRefine((address, context) => {
    const isIndia = address.country.toLowerCase() === "india";
    const valid = isIndia
      ? /^[1-9]\d{5}$/.test(address.pinCode)
      : /^[a-z\d][a-z\d -]{2,11}$/i.test(address.pinCode);
    if (!valid) {
      context.addIssue({
        code: "custom",
        path: ["pinCode"],
        message: isIndia ? "Invalid Indian PIN code." : "Invalid postal code.",
      });
    }
  });

const orderItemSchema = z
  .object({
    productId: z.string().trim().min(1).max(64),
    quantity: z.number().int().min(1).max(99),
    selectedVariant: z
      .record(z.string().trim().min(1).max(40), z.string().trim().min(1).max(80))
      .optional()
      .default({}),
  })
  .strict();

export const createOrderSchema = z
  .object({
    customer: customerSchema,
    shippingAddress: shippingAddressSchema,
    items: z.array(orderItemSchema).min(1).max(50),
  })
  .strict();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
