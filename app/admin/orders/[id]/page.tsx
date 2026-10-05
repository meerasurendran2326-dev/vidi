import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/app/components/ui/OrderStatusBadge";
import { OrderStatusUpdater } from "@/app/components/admin/OrderStatusUpdater";
import { ArrowLeft, MapPin, User, CreditCard } from "lucide-react";

export const metadata = { title: "Order Detail | Admin — VINI VICI VIDI" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { slug: true, images: true } } } },
      user: { select: { id: true, email: true, fullName: true } },
    },
  });

  if (!order) notFound();

  const Section = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#1fe0bb]/60" />
        <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back nav */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-200/70 hover:text-[#1fe0bb] transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Orders
      </Link>

      {/* Title row */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
            Order
          </p>
          <h1
            className="mt-1 text-3xl font-normal text-white"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            #{order.orderNumber}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Status updater */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 p-5">
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Customer info */}
        <Section title="Customer" icon={User}>
          <div className="space-y-1.5 text-sm">
            <p className="font-semibold text-white">{order.customerFullName}</p>
            <p className="text-slate-400">{order.customerEmail}</p>
            <p className="text-slate-400">{order.customerPhone}</p>
            {order.user && (
              <Link
                href={`/admin/customers/${order.user.id}`}
                className="inline-block mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[#1fe0bb]/70 hover:text-[#1fe0bb] transition-colors"
              >
                View Customer Account →
              </Link>
            )}
          </div>
        </Section>

        {/* Shipping address */}
        <Section title="Shipping Address" icon={MapPin}>
          <div className="space-y-0.5 text-sm text-slate-300">
            <p>{order.addressLine1}</p>
            {order.addressLine2 && <p>{order.addressLine2}</p>}
            <p>
              {order.city}, {order.state} — {order.pinCode}
            </p>
            <p>{order.country}</p>
          </div>
        </Section>
      </div>

      {/* Payment info */}
      <Section title="Payment" icon={CreditCard}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <span className="text-slate-500">Razorpay Order ID</span>
          <span className="font-mono text-xs text-slate-300 break-all">
            {order.razorpayOrderId ?? "—"}
          </span>
          <span className="text-slate-500">Razorpay Payment ID</span>
          <span className="font-mono text-xs text-slate-300 break-all">
            {order.razorpayPaymentId ?? "—"}
          </span>
          <span className="text-slate-500">Subtotal</span>
          <span className="text-white">
            ₹{Number(order.subtotal).toLocaleString("en-IN")}
          </span>
          <span className="text-slate-500">Shipping</span>
          <span className="text-white">
            ₹{Number(order.shipping).toLocaleString("en-IN")}
          </span>
          <span className="text-slate-500 font-semibold">Total</span>
          <span className="text-[#1fe0bb] font-bold">
            ₹{Number(order.total).toLocaleString("en-IN")}
          </span>
        </div>
      </Section>

      {/* Line items */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-emerald-900/30">
          <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">
            Items ({order.items.length})
          </h2>
        </div>
        <div className="divide-y divide-emerald-900/20">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              {item.product.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.product.images[0]}
                  alt={item.productName}
                  className="h-14 w-14 rounded-xl object-cover shrink-0 border border-emerald-900/30"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{item.productName}</p>
                {item.selectedVariant &&
                  Object.entries(item.selectedVariant as Record<string, string>).map(
                    ([k, v]) => (
                      <p key={k} className="text-[0.65rem] text-slate-500">
                        {k}: {v}
                      </p>
                    )
                  )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                <p className="text-sm font-semibold text-white">
                  ₹{Number(item.priceAtPurchase).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
