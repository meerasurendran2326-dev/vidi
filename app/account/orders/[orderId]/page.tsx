import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { isValidOrderId } from "@/app/lib/order-access";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { ShaderBackground } from "@/components/ui/adisyon-shader";
import { OrderTimeline } from "@/app/components/ui/OrderTimeline";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/app/components/ui/OrderStatusBadge";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";

interface AccountOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata = {
  title: "Order Details | VINI VICI VIDI Silver Atelier",
  description: "Detailed specification and fulfillment status for your atelier order.",
};

function formatDate(iso: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(iso);
}

export default async function AccountOrderDetailPage({
  params,
}: AccountOrderDetailPageProps) {
  const { orderId } = await params;

  if (!isValidOrderId(orderId)) {
    notFound();
  }

  const user = await requireAuth(`/account/orders/${orderId}`);

  // Validate ownership strictly on the server:
  // Must match both the orderId AND the authenticated user's ID
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      items: {
        include: {
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

  if (!order) {
    notFound();
  }

  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020704] text-slate-100">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-5xl flex-1 px-3.5 py-6 sm:px-8 sm:py-12 lg:px-12">
          {/* Back Navigation */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Orders
            </Link>

            <span className="text-xs text-white/50 truncate max-w-full">
              Account: <strong className="text-white">{user.email}</strong>
            </span>
          </div>

          {/* Order Header Summary Banner */}
          <section className="rounded-3xl border border-emerald-400/25 bg-[#061812]/85 p-4 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#1fe0bb]">
                  Atelier Commission Record
                </span>
                <h1
                  className="mt-1 text-2xl sm:text-3xl font-normal text-white"
                  style={{ fontFamily: "var(--font-editorial), serif" }}
                >
                  Order #{order.orderNumber}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-100/70">
                  <Calendar className="h-3.5 w-3.5 text-[#1fe0bb]" />
                  <span>Placed on {formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <PaymentStatusBadge status={order.paymentStatus} />
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-white/5 bg-black/25 p-3 sm:p-3.5">
                <span className="text-[0.65rem] uppercase tracking-wider text-white/45">
                  Items
                </span>
                <p className="mt-1 text-sm font-semibold text-white">
                  {itemCount} {itemCount === 1 ? "Piece" : "Pieces"}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/25 p-3 sm:p-3.5">
                <span className="text-[0.65rem] uppercase tracking-wider text-white/45">
                  Payment Status
                </span>
                <p className="mt-1 text-sm font-semibold text-emerald-200">
                  {order.paymentStatus}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/25 p-3 sm:p-3.5">
                <span className="text-[0.65rem] uppercase tracking-wider text-white/45">
                  Estimated Delivery
                </span>
                <p className="mt-1 text-sm font-semibold text-white">
                  5–7 business days
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/25 p-3 sm:p-3.5">
                <span className="text-[0.65rem] uppercase tracking-wider text-white/45">
                  Total Amount
                </span>
                <p className="mt-1 text-sm font-semibold text-[#1fe0bb]">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </section>

          {/* Fulfillment Status Presentation: CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED */}
          <div className="mt-8">
            <OrderTimeline status={order.status} />
          </div>

          {/* Main Details Grid: Items and Summary */}
          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Left: Purchased Products & Shipping Address */}
            <div className="space-y-8">
              {/* Purchased Pieces */}
              <section className="rounded-3xl border border-emerald-400/20 bg-[#061812]/80 p-4 sm:p-7 shadow-xl backdrop-blur-xl">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white border-b border-white/10 pb-4">
                  Purchased Pieces
                </h2>

                <div className="mt-5 divide-y divide-white/10">
                  {order.items.map((item) => {
                    const imageSrc = item.product?.images?.[0];
                    const variant = item.selectedVariant as Record<string, string> | null;

                    return (
                      <article
                        key={item.id}
                        className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                            {imageSrc ? (
                              <Image
                                src={imageSrc}
                                alt={item.productName}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-white/30">
                                <Package className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-white">
                              {item.productName}
                            </h3>
                            {variant && Object.keys(variant).length > 0 && (
                              <p className="mt-1 text-xs text-emerald-100/60">
                                {Object.entries(variant)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(" · ")}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-white/50">
                              Quantity: {item.quantity} × ₹
                              {Number(item.priceAtPurchase).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <p className="text-base font-semibold text-emerald-100">
                            ₹
                            {(
                              Number(item.priceAtPurchase) * item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* Shipping Address */}
              <section className="rounded-3xl border border-emerald-400/20 bg-[#061812]/80 p-4 sm:p-7 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-[#1fe0bb] border-b border-white/10 pb-4">
                  <MapPin className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                    Delivery Address
                  </h2>
                </div>

                <address className="mt-4 not-italic text-sm leading-relaxed text-emerald-100/80">
                  <strong className="text-white font-semibold">
                    {order.customerFullName}
                  </strong>
                  <br />
                  {order.addressLine1}
                  <br />
                  {order.addressLine2 && (
                    <>
                      {order.addressLine2}
                      <br />
                    </>
                  )}
                  {order.city}, {order.state} {order.pinCode}
                  <br />
                  {order.country}
                  <br />
                  <span className="text-xs text-white/50 mt-1 inline-block">
                    Phone: {order.customerPhone}
                  </span>
                </address>
              </section>
            </div>

            {/* Right Sidebar: Invoicing & Payment Info */}
            <aside className="space-y-6">
              {/* Order Total Breakdown */}
              <div className="rounded-3xl border border-emerald-400/20 bg-[#061812]/80 p-4 sm:p-6 shadow-xl backdrop-blur-xl">
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white border-b border-white/10 pb-4">
                  Payment Summary
                </h3>

                <dl className="mt-5 space-y-3.5 text-sm">
                  <div className="flex justify-between gap-4 text-white/65">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-white">
                      ₹{Number(order.subtotal).toLocaleString("en-IN")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 text-white/65">
                    <dt>Insured Shipping</dt>
                    <dd className="font-medium text-white">
                      {Number(order.shipping) === 0 ? (
                        <span className="text-emerald-300">Complimentary</span>
                      ) : (
                        `₹${Number(order.shipping).toLocaleString("en-IN")}`
                      )}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-white/10 pt-4 font-bold text-white">
                    <dt className="text-sm uppercase tracking-wider">Total Amount</dt>
                    <dd className="text-xl text-[#1fe0bb]">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </dd>
                  </div>
                </dl>

                {/* Payment Detail note */}
                <div className="mt-6 rounded-xl border border-white/5 bg-black/30 p-3.5 text-xs text-white/60">
                  <div className="flex items-center gap-2 text-white font-medium mb-1">
                    <CreditCard className="h-3.5 w-3.5 text-[#1fe0bb]" />
                    <span>Payment Channel</span>
                  </div>
                  <p>Razorpay Secure Checkout</p>
                  {order.razorpayPaymentId && (
                    <p className="mt-1 font-mono text-[0.68rem] text-white/40 truncate">
                      Ref: {order.razorpayPaymentId}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-[0.7rem] text-emerald-200/60">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1fe0bb]" />
                  <span>256-bit encrypted authentication</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/rings"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#1fe0bb] px-6 text-xs font-bold uppercase tracking-[0.14em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-md"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/account/orders"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-emerald-400/30 px-6 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100 transition-all hover:bg-emerald-950/40"
                >
                  View All Orders
                </Link>
              </div>
            </aside>
          </div>
        </main>

        <FooterColumn />
      </div>
    </div>
  );
}
