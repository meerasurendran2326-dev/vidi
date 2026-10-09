import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/app/components/ui/OrderStatusBadge";
import { Package, Clock, User, Phone, MapPin } from "lucide-react";

export const metadata = { title: "All Client Orders | Admin — VINI VICI VIDI" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const statusFilter = sp.status?.toUpperCase();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const PAGE_SIZE = 20;

  const where = statusFilter && statusFilter !== "ALL" ? { status: statusFilter as never } : {};

  const [orders, total, pendingCount, paidCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        orderNumber: true,
        customerFullName: true,
        customerEmail: true,
        customerPhone: true,
        city: true,
        state: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        items: {
          select: {
            productName: true,
            quantity: true,
          },
        },
      },
    }),
    prisma.order.count({ where }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const statuses = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
            Fulfillment &amp; Commerce
          </p>
          <h1
            className="mt-1 text-3xl font-normal text-white"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            Shopping Orders
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {total} matching orders &middot; {paidCount} paid &middot; {pendingCount} awaiting processing
          </p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[0.62rem] uppercase tracking-wider text-slate-500 font-bold mr-1">
          Filter by Status:
        </span>
        {statuses.map((s) => {
          const active = s === "ALL" ? !statusFilter || statusFilter === "ALL" : statusFilter === s;
          return (
            <Link
              key={s}
              href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={`rounded-full px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition-all ${
                active
                  ? "bg-[#1fe0bb] text-[#03251c] shadow-md shadow-[#1fe0bb]/20"
                  : "border border-emerald-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-600 bg-white/5"
              }`}
            >
              {s === "ALL" ? "All Orders" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-w-0">
          <div className="min-w-[920px]">
            {/* Table header */}
            <div className="grid grid-cols-[1.1fr_1.6fr_1.8fr_1fr_1.2fr_auto] gap-4 px-5 py-3.5 border-b border-emerald-900/30 bg-white/[0.01]">
              {["Order Reference", "Client Information", "Purchased Items", "Amount", "Status & Payment", "Action"].map((h) => (
                <span
                  key={h}
                  className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-400"
                >
                  {h}
                </span>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>No orders found matching the current filter.</p>
              </div>
            )}

            <div className="divide-y divide-emerald-900/20">
              {orders.map((o) => {
                const totalItemUnits = o.items.reduce((acc, i) => acc + i.quantity, 0);

                return (
                  <div
                    key={o.id}
                    className="grid grid-cols-[1.1fr_1.6fr_1.8fr_1fr_1.2fr_auto] gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Order Reference & Date */}
                    <div>
                      <p className="text-xs font-mono font-bold text-white tracking-wide">
                        #{o.orderNumber}
                      </p>
                      <div className="flex items-center gap-1 text-[0.62rem] text-slate-400 mt-1">
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-semibold text-white truncate">
                        {o.customerFullName}
                      </p>
                      <p className="text-[0.65rem] text-slate-400 truncate">
                        {o.customerEmail}
                      </p>
                      <div className="flex items-center gap-2 text-[0.62rem] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          {o.customerPhone}
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-2.5 h-2.5" />
                          {o.city}, {o.state}
                        </span>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="min-w-0">
                      <p className="text-[0.68rem] font-semibold text-[#1fe0bb]">
                        {totalItemUnits} {totalItemUnits === 1 ? "piece" : "pieces"} ({o.items.length} items)
                      </p>
                      <div className="text-[0.65rem] text-slate-400 truncate mt-0.5">
                        {o.items.map((it) => `${it.productName} (×${it.quantity})`).join(", ")}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div>
                      <p className="text-xs font-bold text-white tabular-nums">
                        ₹{Number(o.total).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[0.6rem] uppercase tracking-wider text-slate-500">
                        Net Total
                      </p>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col gap-1.5 items-start">
                      <PaymentStatusBadge status={o.paymentStatus} />
                      <OrderStatusBadge status={o.status} />
                    </div>

                    {/* Action */}
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-900/50 bg-white/5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#1fe0bb] hover:bg-[#1fe0bb] hover:text-[#03251c] transition-all whitespace-nowrap shadow-sm"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className="rounded-xl border border-emerald-900/40 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400 hover:text-[#1fe0bb] hover:border-[#1fe0bb]/40 transition-all"
              >
                &larr; Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className="rounded-xl border border-emerald-900/40 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400 hover:text-[#1fe0bb] hover:border-[#1fe0bb]/40 transition-all"
              >
                Next &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
