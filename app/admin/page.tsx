import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import {
  ShoppingBag,
  CreditCard,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const metadata = { title: "Admin Dashboard | VINI VICI VIDI" };

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-md ${
        accent
          ? "border-[#1fe0bb]/30 bg-[#042e22]/60 shadow-lg shadow-[#1fe0bb]/5"
          : "border-emerald-900/40 bg-[#010d08]/80"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <p
            className={`mt-2 text-2xl sm:text-3xl font-light truncate ${accent ? "text-[#1fe0bb]" : "text-white"}`}
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div
          className={`rounded-xl p-2.5 ${
            accent ? "bg-[#1fe0bb]/10" : "bg-white/5"
          }`}
        >
          <Icon className={`h-5 w-5 ${accent ? "text-[#1fe0bb]" : "text-slate-400"}`} />
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  // Aggregate stats in parallel
  const [
    totalOrders,
    paidOrders,
    pendingOrders,
    revenueAgg,
    productCount,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.product.count({ where: { active: true } }),
    prisma.product.findMany({
      where: { active: true, stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      select: { id: true, name: true, slug: true, stock: true },
      take: 8,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        orderNumber: true,
        customerFullName: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    }),
  ]);

  const revenue = revenueAgg._sum.total?.toNumber() ?? 0;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page title */}
      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
          Overview
        </p>
        <h1
          className="mt-1 text-3xl font-normal text-white"
          style={{ fontFamily: "var(--font-editorial), serif" }}
        >
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={DollarSign}
          label="Total Revenue (Paid)"
          value={`₹${revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          accent
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
        />
        <StatCard
          icon={CreditCard}
          label="Paid Orders"
          value={paidOrders}
          sub={`${totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0}% conversion`}
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={pendingOrders}
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={productCount}
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock (≤5)"
          value={lowStockProducts.length}
          sub={lowStockProducts.length > 0 ? "Attention needed" : "All good"}
        />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-900/30">
            <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#1fe0bb]/70 hover:text-[#1fe0bb] transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-emerald-900/20">
            {recentOrders.length === 0 && (
              <p className="px-5 py-8 text-center text-xs text-slate-500">
                No orders yet.
              </p>
            )}
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition-colors group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-[#1fe0bb] transition-colors">
                    #{order.orderNumber}
                  </p>
                  <p className="text-[0.65rem] text-slate-500">{order.customerFullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[0.62rem] text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-900/30">
            <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
              Low Stock Products
            </h2>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#1fe0bb]/70 hover:text-[#1fe0bb] transition-colors"
            >
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-emerald-900/20">
            {lowStockProducts.length === 0 && (
              <p className="px-5 py-8 text-center text-xs text-slate-500">
                All products are well-stocked.
              </p>
            )}
            {lowStockProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition-colors group"
              >
                <p className="text-xs font-semibold text-white group-hover:text-[#1fe0bb] transition-colors truncate max-w-[60%]">
                  {product.name}
                </p>
                <span
                  className={`text-[0.65rem] font-bold tabular-nums ${
                    product.stock === 0
                      ? "text-rose-400"
                      : product.stock <= 2
                      ? "text-amber-400"
                      : "text-yellow-300"
                  }`}
                >
                  {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
