import { z } from "zod";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { getOrderAccessToken, isValidOrderId, orderAccessTokenMatches } from "@/app/lib/order-access";
import { getAmountInPaise, getRazorpayClient } from "@/app/lib/razorpay";

export const runtime = "nodejs";

const requestSchema = z.object({ orderId: z.string().min(10).max(64) }).strict();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success || !isValidOrderId(parsed.data?.orderId ?? "")) {
    return Response.json({ error: "Invalid order ID." }, { status: 400 });
  }

  const accessToken = await getOrderAccessToken(parsed.data.orderId, request);
  if (!accessToken) return Response.json({ error: "Order not found." }, { status: 404 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentStatus: true,
        razorpayOrderId: true,
        accessTokenHash: true,
      },
    });
    if (!order || !orderAccessTokenMatches(accessToken, order.accessTokenHash)) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.status === "CANCELLED") {
      return Response.json({ error: "This order has been cancelled." }, { status: 409 });
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      return Response.json({ error: "This order is already paid." }, { status: 409 });
    }

    const { client, keyId } = getRazorpayClient();
    const amount = getAmountInPaise(order.total);
    let providerOrderId = order.razorpayOrderId;

    if (providerOrderId) {
      const existingProviderOrder = await client.orders.fetch(providerOrderId);
      if (existingProviderOrder.amount !== amount || existingProviderOrder.currency !== "INR") {
        return Response.json({ error: "Payment order does not match the stored order total." }, { status: 409 });
      }
    } else {
      const providerOrder = await client.orders.create({
        amount,
        currency: "INR",
        receipt: order.orderNumber,
        notes: { internalOrderId: order.id },
      });
      providerOrderId = providerOrder.id;

      const saved = await prisma.order.updateMany({
        where: { id: order.id, razorpayOrderId: null, paymentStatus: { not: PaymentStatus.PAID } },
        data: {
          razorpayOrderId: providerOrderId,
          paymentStatus: PaymentStatus.PENDING,
        },
      });
      if (saved.count !== 1) {
        const latest = await prisma.order.findUnique({
          where: { id: order.id },
          select: { razorpayOrderId: true, paymentStatus: true },
        });
        if (latest?.paymentStatus === PaymentStatus.PAID) {
          return Response.json({ error: "This order is already paid." }, { status: 409 });
        }
        if (!latest?.razorpayOrderId) {
          return Response.json({ error: "Unable to prepare payment for this order." }, { status: 409 });
        }
        providerOrderId = latest.razorpayOrderId;
      }
    }

    if (order.paymentStatus === PaymentStatus.FAILED) {
      await prisma.order.updateMany({
        where: { id: order.id, paymentStatus: PaymentStatus.FAILED },
        data: { paymentStatus: PaymentStatus.PENDING },
      });
    }

    return Response.json({
      internalOrderId: order.id,
      razorpayOrderId: providerOrderId,
      keyId,
      amount,
      currency: "INR",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("credentials are not configured")) {
      return Response.json({ error: "Online payments are not configured." }, { status: 503 });
    }
    console.error("Razorpay order creation failed.");
    return Response.json({ error: "Unable to start payment. Please retry." }, { status: 502 });
  }
}
