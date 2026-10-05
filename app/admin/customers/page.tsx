import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { Users } from "lucide-react";

export const metadata = { title: "Customers | Admin — VINI VICI VIDI" };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
          Members
        </p>
        <h1
          className="mt-1 text-3xl font-normal text-white"
          style={{ fontFamily: "var(--font-editorial), serif" }}
        >
          Customers
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {customers.length} registered accounts
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-emerald-900/30">
          {["Name", "Email", "Phone", "Orders", ""].map((h) => (
            <span
              key={h}
              className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-500"
            >
              {h}
            </span>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Users className="h-10 w-10 text-slate-700" />
            <p className="text-sm text-slate-500">No customers yet.</p>
          </div>
        )}

        <div className="divide-y divide-emerald-900/20">
          {customers.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.fullName}</p>
                <p className="text-[0.62rem] text-slate-500">
                  Since{" "}
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <p className="text-xs text-slate-400 truncate">{c.email}</p>

              <p className="text-xs text-slate-400 whitespace-nowrap">
                {c.phone ?? "—"}
              </p>

              <span className="text-xs font-semibold tabular-nums text-center text-emerald-300">
                {c._count.orders}
              </span>

              <Link
                href={`/admin/customers/${c.id}`}
                className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#1fe0bb]/70 hover:text-[#1fe0bb] transition-colors whitespace-nowrap"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
