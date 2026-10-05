import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/app/components/ui/OrderStatusBadge";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";

export const metadata = { title: "Customer Detail | Admin — VINI VICI VIDI" };

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          _count: { select: { items: true } },
        },
      },
    },
  });

  if (!customer) notFound();

  const totalSpend = customer.orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back nav */}
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-200/70 hover:text-[#1fe0bb] transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Customers
      </Link>

      {/* Profile card */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 p-6 space-y-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
            Customer
          </p>
          <h1
            className="mt-1 text-3xl font-normal text-white"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            {customer.fullName}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Mail className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Phone className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span>{customer.phone ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span>
              Joined{" "}
              {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-900/30">
          {[
            { label: "Total Orders", value: customer.orders.length },
            {
              label: "Paid Orders",
              value: customer.orders.filter((o) => o.paymentStatus === "PAID").length,
            },
            {
              label: "Lifetime Spend",
              value: `₹${totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                {label}
              </p>
              <p
                className="mt-1 text-xl font-light text-[#1fe0bb]"
                style={{ fontFamily: "var(--font-editorial), serif" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order history */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-emerald-900/30">
          <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">
            Order History ({customer.orders.length})
          </h2>
        </div>

        {customer.orders.length === 0 && (
          <p className="py-10 text-center text-xs text-slate-500">
            This customer has not placed any orders yet.
          </p>
        )}

        <div className="divide-y divide-emerald-900/20">
          {customer.orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors flex-wrap"
            >
              <div>
                <p className="text-xs font-semibold text-white">#{o.orderNumber}</p>
                <p className="text-[0.62rem] text-slate-500">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {o._count.items} item{o._count.items !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <PaymentStatusBadge status={o.paymentStatus} />
                <OrderStatusBadge status={o.status} />
                <p className="text-sm font-bold text-white tabular-nums">
                  ₹{Number(o.total).toLocaleString("en-IN")}
                </p>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#1fe0bb]/70 hover:text-[#1fe0bb] transition-colors"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
