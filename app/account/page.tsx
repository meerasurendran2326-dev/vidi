import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { ShaderBackground } from "@/components/ui/adisyon-shader";
import { AccountLogoutButton } from "@/app/components/ui/AccountLogoutButton";
import {
  ArrowRight,
  Package,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

export const metadata = {
  title: "My Account | VINI VICI VIDI Silver Atelier",
  description: "View and manage your VINI VICI VIDI atelier account and order history.",
};

export default async function AccountPage() {
  const user = await requireAuth("/account");

  const [ordersCount, recentOrders] = await Promise.all([
    prisma.order.count({
      where: { userId: user.id },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      take: 2,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    }),
  ]);

  const memberSince = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020704] text-slate-100">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          {/* Header Card */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-[#061812]/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#1fe0bb]/10 blur-3xl pointer-events-none"
            />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-[#0B4A3B] to-[#04241A] text-emerald-200 shadow-lg shadow-emerald-950/50">
                  <User className="h-8 w-8 text-[#1fe0bb]" />
                </div>
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#1fe0bb]">
                    Private Atelier Client
                  </span>
                  <h1
                    className="text-2xl sm:text-3xl font-normal text-white"
                    style={{ fontFamily: "var(--font-editorial), serif" }}
                  >
                    {user.fullName}
                  </h1>
                  <p className="text-xs text-emerald-100/60 mt-0.5">
                    Member since {memberSince}
                  </p>
                </div>
              </div>

              <AccountLogoutButton />
            </div>
          </section>

          {/* Account Details & Quick Overview Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Contact & Profile Info */}
            <div className="rounded-2xl border border-emerald-400/20 bg-[#061812]/80 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#1fe0bb]">
                <ShieldCheck className="h-4 w-4" />
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Client Profile
                </h2>
              </div>

              <dl className="mt-5 space-y-4 text-xs">
                <div>
                  <dt className="text-white/45 uppercase tracking-wider text-[0.65rem]">
                    Full Name
                  </dt>
                  <dd className="mt-0.5 font-medium text-white">{user.fullName}</dd>
                </div>
                <div>
                  <dt className="text-white/45 uppercase tracking-wider text-[0.65rem]">
                    Email Address
                  </dt>
                  <dd className="mt-0.5 font-medium text-white">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-white/45 uppercase tracking-wider text-[0.65rem]">
                    Primary Contact
                  </dt>
                  <dd className="mt-0.5 font-medium text-white">
                    {user.phone || "Not provided"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Orders Summary Card */}
            <div className="md:col-span-2 rounded-2xl border border-emerald-400/20 bg-[#061812]/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-[#1fe0bb]">
                    <Package className="h-4 w-4" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                      Order History
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-950/60 border border-emerald-400/30 px-3 py-0.5 text-xs font-semibold text-emerald-200">
                    {ordersCount} {ordersCount === 1 ? "Order" : "Orders"}
                  </span>
                </div>

                {ordersCount === 0 ? (
                  <div className="py-8 text-center text-sm text-emerald-100/60">
                    <p>You have not placed any orders yet.</p>
                    <p className="mt-1 text-xs text-white/40">
                      Explore our handcrafted pure 925 sterling silver jewelry.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-white/50">
                      Review status and tracking for your active and previous orders:
                    </p>
                    {recentOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-black/25 px-4 py-2.5 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-white">
                            {ord.orderNumber}
                          </span>
                          <span className="ml-2 text-white/40">
                            {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              dateStyle: "medium",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-emerald-200">
                            ₹{Number(ord.total).toLocaleString("en-IN")}
                          </span>
                          <Link
                            href={`/account/orders/${ord.id}`}
                            className="text-[#1fe0bb] hover:underline"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <Link
                  href="/account/orders"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#1fe0bb] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-md"
                >
                  View All Orders <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/rings"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-400/30 px-5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100 transition-all hover:bg-emerald-950/40"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </main>

        <FooterColumn />
      </div>
    </div>
  );
}
