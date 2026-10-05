"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Clock3,
  PackageCheck,
} from "lucide-react";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { ShaderBackground } from "@/components/ui/adisyon-shader";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "COMPLETED";

type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "AUTHORIZED"
  | "REFUNDED";

interface OrderDetails {
  id: string;
  orderNumber: string;
  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  subtotal: string;
  shipping: string;
  total: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    priceAtPurchase: string;
    quantity: number;
    selectedVariant: Record<string, string> | null;
  }>;
}

interface OrderSuccessClientProps {
  orderId: string;
}

const fulfillmentStages: Array<
  Exclude<OrderStatus, "PENDING" | "CANCELLED" | "COMPLETED">
> = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending confirmation",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function OrderSuccessClient({ orderId }: OrderSuccessClientProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loadState, setLoadState] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Order details are unavailable.");
        const payload = (await response.json()) as { order?: OrderDetails };
        if (!payload.order) throw new Error("Order details are unavailable.");
        setOrder(payload.order);
        setLoadState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setLoadState("unavailable");
      });

    return () => controller.abort();
  }, [orderId]);

  const paid = order?.paymentStatus === "PAID";
  const currentStage = order
    ? order.status === "COMPLETED" || order.status === "DELIVERED"
      ? fulfillmentStages.length - 1
      : fulfillmentStages.indexOf(
          order.status as (typeof fulfillmentStages)[number],
        )
    : -1;
  const cancelled = order?.status === "CANCELLED";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020704] text-slate-100">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="h-full w-full opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-3.5 py-6 sm:px-8 sm:py-12 lg:px-12">
          {loadState === "loading" ? (
            <div
              role="status"
              className="mx-auto my-16 max-w-xl animate-pulse rounded-2xl border border-emerald-300/15 bg-[#06130e]/70 p-8 text-center text-sm text-emerald-100/70"
            >
              Loading order details…
            </div>
          ) : loadState === "unavailable" || !order ? (
            <section className="mx-auto my-12 max-w-xl rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-5 text-center shadow-xl backdrop-blur-xl sm:p-10">
              <CircleAlert className="mx-auto h-9 w-9 text-amber-300" />
              <h1
                className="mt-4 text-xl font-semibold text-white sm:text-2xl"
                style={{ fontFamily: "var(--font-editorial), serif" }}
              >
                Order details unavailable
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-emerald-100/70">
                This order link is invalid or no longer authorized. Open the
                original order confirmation on this device or contact the
                atelier.
              </p>
              <Link
                href="/rings"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-emerald-600"
              >
                Continue shopping
              </Link>
            </section>
          ) : (
            <>
              <section className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-4 text-center shadow-xl shadow-black/25 backdrop-blur-xl sm:p-9">
                <span
                  className={`mx-auto grid h-14 w-14 place-items-center rounded-full border ${paid ? "border-emerald-300/45 bg-emerald-500/15 text-emerald-200" : "border-amber-300/40 bg-amber-500/10 text-amber-200"}`}
                >
                  {paid ? (
                    <Check className="h-7 w-7" />
                  ) : (
                    <Clock3 className="h-7 w-7" />
                  )}
                </span>
                <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  Vini Vici Vidi · Silver Atelier
                </p>
                <h1
                  className="mt-2 text-2xl font-semibold text-white sm:text-4xl"
                  style={{ fontFamily: "var(--font-editorial), serif" }}
                >
                  {paid ? "Payment confirmed" : "Order received"}
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-emerald-100/70">
                  {paid
                    ? "Your payment has been verified. The atelier will share shipping updates as your order progresses."
                    : `Your order ${order.orderNumber} is currently ${order.paymentStatus.toLowerCase()}. This page reflects the server-verified payment status.`}
                </p>
                <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-left text-xs sm:px-6">
                  <span className="text-white/55">Order number</span>
                  <strong className="font-semibold text-white">
                    {order.orderNumber}
                  </strong>
                  <span className="text-white/55">Payment</span>
                  <strong
                    className={
                      paid
                        ? "font-semibold text-emerald-200"
                        : "font-semibold text-amber-200"
                    }
                  >
                    {order.paymentStatus}
                  </strong>
                </div>
              </section>

              <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section
                  id="order-details"
                  className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-5 shadow-lg backdrop-blur-xl sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                        Purchased pieces
                      </h2>
                      <p className="mt-1 text-xs text-white/55">
                        Placed {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-900/30 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                      <PackageCheck className="h-4 w-4" />
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <article
                        key={item.id}
                        className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-white">
                            {item.productName}
                          </h3>
                          {item.selectedVariant &&
                            Object.keys(item.selectedVariant).length > 0 && (
                              <p className="mt-1 text-xs text-emerald-100/60">
                                {Object.entries(item.selectedVariant)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(" · ")}
                              </p>
                            )}
                          <p className="mt-1 text-xs text-white/55">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-emerald-100">
                            ₹
                            {Number(item.priceAtPurchase).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                          <p className="mt-1 text-xs text-white/50">
                            ₹
                            {(
                              Number(item.priceAtPurchase) * item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                      Shipping address
                    </h2>
                    <address className="mt-3 not-italic text-sm leading-relaxed text-emerald-100/75">
                      {order.customerFullName}
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
                    </address>
                    <p className="mt-4 text-xs text-white/50">
                      Estimated delivery: 5–7 business days (estimate; to be
                      confirmed by the atelier).
                    </p>
                  </div>
                </section>

                <aside className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-5 shadow-lg backdrop-blur-xl sm:p-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                    Order total
                  </h2>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-4 text-white/65">
                      <dt>Subtotal</dt>
                      <dd className="text-white">
                        ₹{Number(order.subtotal).toLocaleString("en-IN")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 text-white/65">
                      <dt>Shipping</dt>
                      <dd className="text-white">
                        ₹{Number(order.shipping).toLocaleString("en-IN")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-white/10 pt-4 font-bold text-white">
                      <dt>Total</dt>
                      <dd className="text-lg text-emerald-200">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 border-t border-white/10 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white">
                      Order progress
                    </h3>
                    {cancelled ? (
                      <p className="mt-3 text-sm text-rose-200">
                        This order was cancelled.
                      </p>
                    ) : (
                      <ol className="mt-4 space-y-3">
                        {fulfillmentStages.map((stage, index) => {
                          const complete = currentStage >= index;
                          return (
                            <li key={stage} className="flex items-center gap-3">
                              <span
                                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${complete ? "border-emerald-300 bg-emerald-500/20 text-emerald-200" : "border-white/20 text-white/35"}`}
                              >
                                {complete ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                )}
                              </span>
                              <span
                                className={`text-xs uppercase tracking-wider ${complete ? "text-emerald-100" : "text-white/45"}`}
                              >
                                {statusLabels[stage]}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>
                </aside>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/rings"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300/30 px-6 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100 transition-colors hover:bg-emerald-900/30"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/account/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300/30 px-6 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100 transition-colors hover:bg-emerald-900/30"
                >
                  My Account Orders
                </Link>
                <a
                  href="#order-details"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1fe0bb] px-6 text-xs font-bold uppercase tracking-[0.14em] text-[#03251c] transition-colors hover:bg-emerald-200"
                >
                  View Order <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </>
          )}
        </main>
        <FooterColumn />
      </div>
    </div>
  );
}
