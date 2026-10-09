import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { verifyRazorpayWebhookSignature } from "@/app/lib/razorpay";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return Response.json({ error: "Missing webhook signature." }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return Response.json({ error: "Unable to read request payload." }, { status: 400 });
  }

  // Verify HMAC-SHA256 signature
  const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
  if (!isValid) {
    return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let eventData: any;
  try {
    eventData = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const eventName = eventData?.event;
  const paymentEntity = eventData?.payload?.payment?.entity;
  const orderEntity = eventData?.payload?.order?.entity;

  const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
  const razorpayPaymentId = paymentEntity?.id;

  if (!razorpayOrderId) {
    return Response.json({ received: true, note: "No associated order_id found." });
  }

  try {
    const order = await prisma.order.findFirst({
      where: { razorpayOrderId },
      include: { items: true },
    });

    if (!order) {
      return Response.json({ received: true, note: "Order not matched in database." });
    }

    if (eventName === "payment.captured" || eventName === "order.paid") {
      // Idempotency: if order is already paid, do nothing
      if (order.paymentStatus === PaymentStatus.PAID) {
        return Response.json({ received: true, status: "already_paid" });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: "CONFIRMED",
          razorpayPaymentId: razorpayPaymentId || order.razorpayPaymentId,
        },
      });

      return Response.json({ received: true, status: "marked_paid" });
    }

    if (eventName === "payment.failed") {
      // Idempotency check: if order is already paid or cancelled, don't revert
      if (order.paymentStatus === PaymentStatus.PAID || order.status === "CANCELLED") {
        return Response.json({ received: true, status: "ignored_due_to_current_state" });
      }

      // If already recorded failed, don't double restore stock
      if (order.paymentStatus === PaymentStatus.FAILED) {
        return Response.json({ received: true, status: "already_marked_failed" });
      }

      // In a transaction: mark FAILED and restore stock
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.FAILED,
          },
        });
      });

      return Response.json({ received: true, status: "marked_failed_and_stock_restored" });
    }

    return Response.json({ received: true, event: eventName });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);
    return Response.json({ error: "Webhook processing error." }, { status: 500 });
  }
}
