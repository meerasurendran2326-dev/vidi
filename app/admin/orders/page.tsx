import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/app/components/ui/OrderStatusBadge";

export const metadata = { title: "Orders | Admin — VINI VICI VIDI" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const statusFilter = sp.status?.toUpperCase();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const PAGE_SIZE = 20;

  const where = statusFilter ? { status: statusFilter as never } : {};

  const [orders, total] = await Promise.all([
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
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
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
      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
          Fulfillment
        </p>
        <h1
          className="mt-1 text-3xl font-normal text-white"
          style={{ fontFamily: "var(--font-editorial), serif" }}
        >
          Orders
        </h1>
        <p className="mt-1 text-xs text-slate-500">{total} total orders</p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => {
          const active = s === "ALL" ? !statusFilter : statusFilter === s;
          return (
            <Link
              key={s}
              href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={`rounded-full px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition-all ${
                active
                  ? "bg-[#1fe0bb]/10 text-[#1fe0bb] border border-[#1fe0bb]/30"
                  : "border border-emerald-900/40 text-slate-500 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-emerald-900/30">
          {["#", "Customer", "Items", "Total", "Payment", "Status", ""].map((h) => (
            <span
              key={h}
              className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-500"
            >
              {h}
            </span>
          ))}
        </div>

        {orders.length === 0 && (
          <p className="py-12 text-center text-xs text-slate-500">
            No orders match the current filter.
          </p>
        )}

        <div className="divide-y divide-emerald-900/20">
          {orders.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-[0.65rem] font-mono text-slate-400">
                {o.orderNumber}
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {o.customerFullName}
                </p>
                <p className="text-[0.62rem] text-slate-500 truncate">
                  {o.customerEmail}
                </p>
              </div>

              <span className="text-xs text-slate-400 text-center">
                {o._count.items}
              </span>

              <span className="text-xs font-semibold text-white tabular-nums whitespace-nowrap">
                ₹{Number(o.total).toLocaleString("en-IN")}
              </span>

              <PaymentStatusBadge status={o.paymentStatus} />
              <OrderStatusBadge status={o.status} />

              <Link
                href={`/admin/orders/${o.id}`}
                className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#1fe0bb]/70 hover:text-[#1fe0bb] transition-colors whitespace-nowrap"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className="rounded-xl border border-emerald-900/40 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400 hover:text-[#1fe0bb] hover:border-[#1fe0bb]/40 transition-all"
              >
                ← Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className="rounded-xl border border-emerald-900/40 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400 hover:text-[#1fe0bb] hover:border-[#1fe0bb]/40 transition-all"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
