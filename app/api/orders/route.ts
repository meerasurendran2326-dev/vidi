import { randomBytes } from "node:crypto";
import { Prisma, type Product } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import {
  createOrderAccessToken,
  hashOrderAccessToken,
  orderAccessCookieName,
} from "@/app/lib/order-access";
import { createOrderSchema, type CreateOrderInput } from "@/app/lib/order-validation";
import type { SelectedOptions } from "@/app/lib/cart-utils";
import { getCurrentUser } from "@/app/lib/auth";

export const runtime = "nodejs";

class OrderApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

interface NormalizedOrderLine {
  productId: string;
  quantity: number;
  selectedVariant: SelectedOptions;
}

function normalizeOrderLines(items: CreateOrderInput["items"]): NormalizedOrderLine[] {
  const merged = new Map<string, NormalizedOrderLine>();

  for (const item of items) {
    const selectedVariant = Object.fromEntries(
      Object.entries(item.selectedVariant).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    );
    const key = JSON.stringify([item.productId, Object.entries(selectedVariant)]);
    const existing = merged.get(key);
    const quantity = (existing?.quantity ?? 0) + item.quantity;
    if (quantity > 99) {
      throw new OrderApiError("Combined quantity cannot exceed 99 per product variant.", 400);
    }
    merged.set(key, { productId: item.productId, quantity, selectedVariant });
  }

  return Array.from(merged.values());
}

function supportsSelectedVariant(product: Product, selected: SelectedOptions): boolean {
  const selections = Object.entries(selected);
  if (selections.length === 0) return true;
  if (!product.variants || typeof product.variants !== "object" || Array.isArray(product.variants)) {
    return false;
  }

  const definitions = product.variants as Record<string, unknown>;
  return selections.every(([key, value]) => {
    const allowed = definitions[key];
    return Array.isArray(allowed) && allowed.every((option) => typeof option === "string") && allowed.includes(value);
  });
}

function getShippingAmount(): Prisma.Decimal {
  const amount = process.env.ORDER_SHIPPING_AMOUNT ?? "0.00";
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(amount)) {
    throw new Error("ORDER_SHIPPING_AMOUNT must be a non-negative amount with at most two decimal places.");
  }
  return new Prisma.Decimal(amount);
}

function newOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `VVV-${date}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function validationError(issues: Array<{ path: PropertyKey[]; message: string }>) {
  return Response.json(
    {
      error: "Invalid order request.",
      details: issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
      })),
    },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);

  let lines: NormalizedOrderLine[];
  let shipping: Prisma.Decimal;
  try {
    lines = normalizeOrderLines(parsed.data.items);
    shipping = getShippingAmount();
  } catch (error) {
    if (error instanceof OrderApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Order configuration is invalid." }, { status: 500 });
  }

  try {
    const currentUser = await getCurrentUser();
    const accessToken = createOrderAccessToken();
    const order = await prisma.$transaction(
      async (transaction) => {
        const products = await transaction.product.findMany({
          where: {
            id: { in: Array.from(new Set(lines.map((line) => line.productId))) },
            active: true,
          },
        });
        const productById = new Map(products.map((product) => [product.id, product]));

        for (const line of lines) {
          const product = productById.get(line.productId);
          if (!product) {
            throw new OrderApiError("One or more products are unavailable.", 409);
          }
          if (!supportsSelectedVariant(product, line.selectedVariant)) {
            throw new OrderApiError(`Selected variant is unavailable for ${product.name}.`, 400);
          }
          if (product.stock < line.quantity) {
            throw new OrderApiError(`Insufficient stock for ${product.name}.`, 409);
          }
        }

        let subtotal = new Prisma.Decimal(0);
        for (const line of lines) {
          const product = productById.get(line.productId)!;
          const reserved = await transaction.product.updateMany({
            where: {
              id: product.id,
              active: true,
              stock: { gte: line.quantity },
            },
            data: { stock: { decrement: line.quantity } },
          });
          if (reserved.count !== 1) {
            throw new OrderApiError(`Insufficient stock for ${product.name}.`, 409);
          }
          subtotal = subtotal.add(product.price.mul(line.quantity));
        }

        const total = subtotal.add(shipping);
        return transaction.order.create({
          data: {
            orderNumber: newOrderNumber(),
            userId: currentUser?.id ?? null,
            customerFullName: parsed.data.customer.fullName,
            customerEmail: parsed.data.customer.email,
            customerPhone: parsed.data.customer.phone,
            addressLine1: parsed.data.shippingAddress.addressLine1,
            addressLine2: parsed.data.shippingAddress.addressLine2 || null,
            city: parsed.data.shippingAddress.city,
            state: parsed.data.shippingAddress.state,
            pinCode: parsed.data.shippingAddress.pinCode,
            country: parsed.data.shippingAddress.country,
            subtotal,
            shipping,
            total,
            accessTokenHash: hashOrderAccessToken(accessToken),
            items: {
              create: lines.map((line) => {
                const product = productById.get(line.productId)!;
                return {
                  productId: product.id,
                  productName: product.name,
                  priceAtPurchase: product.price,
                  quantity: line.quantity,
                  ...(Object.keys(line.selectedVariant).length > 0
                    ? { selectedVariant: line.selectedVariant as Prisma.InputJsonObject }
                    : {}),
                };
              }),
            },
          },
          select: {
            id: true,
            orderNumber: true,
            subtotal: true,
            shipping: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
          },
        }).then((created) => ({ created, accessToken }));
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    const cookieStore = await cookies();
    cookieStore.set(orderAccessCookieName(order.created.id), order.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return Response.json(
      {
        order: {
          ...order.created,
          subtotal: order.created.subtotal.toFixed(2),
          shipping: order.created.shipping.toFixed(2),
          total: order.created.total.toFixed(2),
          createdAt: order.created.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OrderApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return Response.json(
        { error: "Inventory changed during checkout. Please review your cart and retry." },
        { status: 409 },
      );
    }

    console.error("Order creation failed.");
    return Response.json({ error: "Unable to create order." }, { status: 500 });
  }
}
