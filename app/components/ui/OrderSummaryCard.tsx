import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package } from "lucide-react";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "./OrderStatusBadge";

export interface OrderItemPreview {
  id: string;
  productName: string;
  quantity: number;
  priceAtPurchase: string;
  selectedVariant?: Record<string, string> | null;
  product?: {
    slug: string;
    images: string[];
  } | null;
}

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  total: string;
  subtotal: string;
  shipping: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItemPreview[];
}

interface OrderSummaryCardProps {
  order: CustomerOrderSummary;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const itemCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#061812]/80 p-5 sm:p-7 shadow-xl shadow-black/25 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:bg-[#072018]/90">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1fe0bb]">
              Order #{order.orderNumber}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/55">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Product Preview */}
      <div className="my-5 space-y-3">
        {order.items.slice(0, 3).map((item) => {
          const imageSrc = item.product?.images?.[0];
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-1.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={item.productName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-white/30">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-xs sm:text-sm font-medium text-white">
                    {item.productName}
                  </h4>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[0.68rem] text-emerald-100/60">
                    <span>Qty: {item.quantity}</span>
                    {item.selectedVariant &&
                      Object.entries(item.selectedVariant).map(([k, v]) => (
                        <span key={k}>
                          · {k}: {v}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-xs sm:text-sm font-semibold text-emerald-100">
                  ₹{Number(item.priceAtPurchase).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}

        {order.items.length > 3 && (
          <p className="text-[0.7rem] text-white/45 italic">
            + {order.items.length - 3} additional piece(s) in this order
          </p>
        )}
      </div>

      {/* Card Footer: Total & View Order button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-5">
        <div>
          <span className="text-[0.68rem] uppercase tracking-wider text-white/50">
            Total ({itemCount} {itemCount === 1 ? "piece" : "pieces"})
          </span>
          <p className="text-lg font-bold text-white sm:text-xl">
            ₹{Number(order.total).toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/40 px-6 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100 transition-all hover:border-[#1fe0bb] hover:bg-[#1fe0bb] hover:text-[#03251c] shadow-md"
        >
          View Order <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
