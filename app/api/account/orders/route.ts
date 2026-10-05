import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json(
      { error: "Authentication required to view orders." },
      { status: 401 },
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
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
            product: {
              select: {
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return Response.json({
      orders: orders.map((order) => ({
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
      })),
    });
  } catch (error) {
    console.error("Fetch account orders error:", error);
    return Response.json(
      { error: "Unable to retrieve orders. Please try again later." },
      { status: 500 },
    );
  }
}
