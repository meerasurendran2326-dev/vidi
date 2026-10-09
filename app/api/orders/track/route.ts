import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getOrderAccessToken, orderAccessTokenMatches } from "@/app/lib/order-access";

export const runtime = "nodejs";

function normalizePhone(val: string): string {
  return val.replace(/\D/g, "").slice(-10);
}

export async function POST(req: NextRequest) {
  let body: { orderId?: string; contact?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const orderId = body.orderId?.trim();
  const contact = body.contact?.trim().toLowerCase();

  if (!orderId) {
    return NextResponse.json({ error: "Order Number or ID is required." }, { status: 400 });
  }

  if (!contact) {
    return NextResponse.json(
      { error: "Email or Phone Number is required to securely verify your order." },
      { status: 400 }
    );
  }

  try {
    // Find order by ID or orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderId },
          { razorpayOrderId: orderId },
        ],
      },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            selectedVariant: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check your order details." },
        { status: 404 }
      );
    }

    // Verify ownership via access token, email, or phone
    let isAuthorized = false;

    const cookieToken = await getOrderAccessToken(order.id, req);
    if (cookieToken && orderAccessTokenMatches(cookieToken, order.accessTokenHash)) {
      isAuthorized = true;
    }

    if (!isAuthorized && contact) {
      const emailMatches = order.customerEmail.toLowerCase().trim() === contact;
      const phoneOrder = normalizePhone(order.customerPhone);
      const phoneInput = normalizePhone(contact);
      const phoneMatches = phoneInput.length >= 8 && phoneOrder === phoneInput;

      if (emailMatches || phoneMatches) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Verification failed. The email or phone does not match this order." },
        { status: 404 }
      );
    }

    // Return non-sensitive tracking information
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      destinationCity: order.city,
      destinationState: order.state,
      items: order.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        variant: i.selectedVariant,
      })),
    });
  } catch (err) {
    console.error("Order tracking error:", err);
    return NextResponse.json({ error: "Failed to locate order." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("id")?.trim();
  const contact = req.nextUrl.searchParams.get("contact")?.trim().toLowerCase();

  if (!orderId) {
    return NextResponse.json({ error: "Order Number or ID is required." }, { status: 400 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderId },
        ],
      },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            selectedVariant: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    let isAuthorized = false;
    const cookieToken = await getOrderAccessToken(order.id, req);
    if (cookieToken && orderAccessTokenMatches(cookieToken, order.accessTokenHash)) {
      isAuthorized = true;
    }

    if (!isAuthorized && contact) {
      const emailMatches = order.customerEmail.toLowerCase().trim() === contact;
      const phoneOrder = normalizePhone(order.customerPhone);
      const phoneInput = normalizePhone(contact);
      const phoneMatches = phoneInput.length >= 8 && phoneOrder === phoneInput;

      if (emailMatches || phoneMatches) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Verification required. Please provide the email or phone used when placing the order." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      destinationCity: order.city,
      destinationState: order.state,
      items: order.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        variant: i.selectedVariant,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve order." }, { status: 500 });
  }
}
