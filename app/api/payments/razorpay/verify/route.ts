import { Prisma, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { getOrderAccessToken, isValidOrderId, orderAccessTokenMatches } from "@/app/lib/order-access";
import { getAmountInPaise, getRazorpayClient, verifyRazorpaySignature } from "@/app/lib/razorpay";

export const runtime = "nodejs";

const requestSchema = z.object({
  orderId: z.string().min(10).max(64),
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().regex(/^[a-f\d]{64}$/i),
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
    return Response.json({ error: "Invalid payment verification request." }, { status: 400 });
  }

  const data = parsed.data;
  const accessToken = await getOrderAccessToken(data.orderId, request);
  if (!accessToken) return Response.json({ error: "Order not found." }, { status: 404 });

  try {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        total: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        accessTokenHash: true,
      },
    });
    if (!order || !orderAccessTokenMatches(accessToken, order.accessTokenHash)) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.status === "CANCELLED" || !order.razorpayOrderId || order.razorpayOrderId !== data.razorpay_order_id) {
      return Response.json({ error: "Payment does not match this order." }, { status: 409 });
    }

    let validSignature = false;
    try {
      validSignature = verifyRazorpaySignature(
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature,
      );
    } catch {
      return Response.json({ error: "Online payments are not configured." }, { status: 503 });
    }
    if (!validSignature) {
      return Response.json({ error: "Payment signature is invalid." }, { status: 400 });
    }

    const { client } = getRazorpayClient();
    const payment = await client.payments.fetch(data.razorpay_payment_id);
    const expectedAmount = getAmountInPaise(order.total);
    if (
      payment.order_id !== order.razorpayOrderId ||
      payment.amount !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      return Response.json({ error: "Payment details do not match the order." }, { status: 409 });
    }
    if (payment.status !== "captured") {
      return Response.json({
        verified: false,
        paymentStatus: payment.status === "failed" ? "FAILED" : "PENDING",
        message: "Payment has not been captured yet.",
      }, { status: 202 });
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      if (order.razorpayPaymentId === data.razorpay_payment_id) {
        return Response.json({ verified: true, orderId: order.id, paymentStatus: "PAID" });
      }
      return Response.json({ error: "A different payment has already been recorded." }, { status: 409 });
    }

    const updated = await prisma.order.updateMany({
      where: {
        id: order.id,
        razorpayOrderId: data.razorpay_order_id,
        razorpayPaymentId: null,
        paymentStatus: { not: PaymentStatus.PAID },
        status: { not: "CANCELLED" },
      },
      data: {
        razorpayPaymentId: data.razorpay_payment_id,
        paymentStatus: PaymentStatus.PAID,
        status: "CONFIRMED",
      },
    });
    if (updated.count !== 1) {
      const current = await prisma.order.findUnique({
        where: { id: order.id },
        select: { paymentStatus: true, razorpayPaymentId: true },
      });
      if (current?.paymentStatus === PaymentStatus.PAID && current.razorpayPaymentId === data.razorpay_payment_id) {
        return Response.json({ verified: true, orderId: order.id, paymentStatus: "PAID" });
      }
      return Response.json({ error: "Order payment state changed. Please refresh the order." }, { status: 409 });
    }

    return Response.json({ verified: true, orderId: order.id, paymentStatus: "PAID" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "Payment has already been applied to another order." }, { status: 409 });
    }
    console.error("Razorpay verification failed.");
    return Response.json({ error: "Unable to verify payment." }, { status: 502 });
  }
}
