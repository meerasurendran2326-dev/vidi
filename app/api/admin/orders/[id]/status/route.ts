import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser, isAdminEmail } from "@/app/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid status value.",
        allowed: ORDER_STATUSES,
      },
      { status: 400 }
    );
  }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    if (parsed.data.status === "CANCELLED" && existingOrder.status !== "CANCELLED") {
      const updatedOrder = await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
        return tx.order.update({
          where: { id },
          data: { status: "CANCELLED" },
          select: { id: true, orderNumber: true, status: true },
        });
      });
      return Response.json({ order: updatedOrder });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, orderNumber: true, status: true },
    });
    return Response.json({ order });
  } catch {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }
}
