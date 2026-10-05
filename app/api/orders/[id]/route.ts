import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import {
  isValidOrderId,
  orderAccessCookieName,
  orderAccessTokenMatches,
} from "@/app/lib/order-access";
import { getCurrentUser } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isValidOrderId(id)) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  const currentUser = await getCurrentUser();
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization);
  const cookieStore = await cookies();
  const accessToken =
    match?.[1] ?? cookieStore.get(orderAccessCookieName(id))?.value;

  try {
    const access = await prisma.order.findUnique({
      where: { id },
      select: { id: true, userId: true, accessTokenHash: true },
    });
    if (!access) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    const isOwner = currentUser && access.userId && access.userId === currentUser.id;
    const hasValidToken = accessToken && orderAccessTokenMatches(accessToken, access.accessTokenHash);

    if (!isOwner && !hasValidToken) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        customerFullName: true,
        customerEmail: true,
        customerPhone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        pinCode: true,
        country: true,
        subtotal: true,
        shipping: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            priceAtPurchase: true,
            quantity: true,
            selectedVariant: true,
          },
        },
      },
    });
    if (!order) return Response.json({ error: "Order not found." }, { status: 404 });

    return Response.json({
      order: {
        ...order,
        subtotal: order.subtotal.toFixed(2),
        shipping: order.shipping.toFixed(2),
        total: order.total.toFixed(2),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
          ...item,
          priceAtPurchase: item.priceAtPurchase.toFixed(2),
        })),
      },
    });
  } catch {
    return Response.json(
      { error: "Order lookup is temporarily unavailable." },
      { status: 503 },
    );
  }
}
