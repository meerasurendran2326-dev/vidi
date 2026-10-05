import { PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { getOrderAccessToken, isValidOrderId, orderAccessTokenMatches } from "@/app/lib/order-access";
import { getAmountInPaise, getRazorpayClient } from "@/app/lib/razorpay";

export const runtime = "nodejs";

const requestSchema = z.object({
  orderId: z.string().min(10).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
}).strict();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success || !isValidOrderId(parsed.data?.orderId ?? "")) {
    return Response.json({ error: "Invalid payment failure request." }, { status: 400 });
  }

  const accessToken = await getOrderAccessToken(parsed.data.orderId, request);
  if (!accessToken) return Response.json({ error: "Order not found." }, { status: 404 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        total: true,
        razorpayOrderId: true,
        accessTokenHash: true,
      },
    });
    if (!order || !orderAccessTokenMatches(accessToken, order.accessTokenHash)) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      return Response.json({ error: "This order is already paid." }, { status: 409 });
    }
    if (!order.razorpayOrderId || order.status === "CANCELLED") {
      return Response.json({ error: "Payment does not match this order." }, { status: 409 });
    }

    const { client } = getRazorpayClient();
    const payment = await client.payments.fetch(parsed.data.razorpay_payment_id);
    if (
      payment.order_id !== order.razorpayOrderId ||
      payment.amount !== getAmountInPaise(order.total) ||
      payment.currency !== "INR" ||
      payment.status !== "failed"
    ) {
      return Response.json({ error: "Razorpay has not confirmed a failed payment." }, { status: 409 });
    }

    await prisma.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: { not: PaymentStatus.PAID },
        status: { not: "CANCELLED" },
      },
      data: {
        paymentStatus: PaymentStatus.FAILED,
      },
    });

    return Response.json({ recorded: true, paymentStatus: "FAILED" });
  } catch {
    return Response.json({ error: "Unable to confirm payment failure." }, { status: 502 });
  }
}
