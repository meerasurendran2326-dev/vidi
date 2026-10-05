import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { ShaderBackground } from "@/components/ui/adisyon-shader";
import { OrderSummaryCard } from "@/app/components/ui/OrderSummaryCard";
import { ArrowLeft, Package, Sparkles } from "lucide-react";

export const metadata = {
  title: "My Orders | VINI VICI VIDI Silver Atelier",
  description: "View your order history, fulfillment progress, and tracking details.",
};

export default async function AccountOrdersPage() {
  const user = await requireAuth("/account/orders");

  const rawOrders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
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

  const orders = rawOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    total: order.total.toFixed(2),
    subtotal: order.subtotal.toFixed(2),
    shipping: order.shipping.toFixed(2),
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase.toFixed(2),
      selectedVariant: item.selectedVariant as Record<string, string> | null,
      product: item.product,
    })),
  }));

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
          {/* Breadcrumb / Back button */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Account
            </Link>

            <span className="text-xs text-white/50">
              Signed in as <strong className="text-white">{user.email}</strong>
            </span>
          </div>

          {/* Page Title */}
          <section className="mb-8">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#1fe0bb]">
              Atelier Commissions & Orders
            </span>
            <h1
              className="mt-1 text-3xl sm:text-4xl font-normal text-white"
              style={{ fontFamily: "var(--font-editorial), serif" }}
            >
              Order History
            </h1>
            <p className="mt-2 text-sm text-emerald-100/70 max-w-2xl">
              Track fulfillment, delivery schedules, and inspect authentic invoices
              for your VINI VICI VIDI sterling silver acquisitions.
            </p>
          </section>

          {/* Orders Listing */}
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-emerald-400/20 bg-[#061812]/80 p-10 text-center shadow-xl backdrop-blur-xl sm:p-14">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/30 bg-emerald-950/40 text-emerald-300">
                <Package className="h-8 w-8 text-[#1fe0bb]" />
              </div>
              <h2
                className="mt-5 text-2xl font-normal text-white"
                style={{ fontFamily: "var(--font-editorial), serif" }}
              >
                No Orders Placed Yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-emerald-100/60 sm:text-sm">
                Your portfolio of fine silver commissions is currently empty. Explore
                our curated vault of pure 925 sterling silver rings, bracelets, and pendants.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/rings"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1fe0bb] px-7 text-xs font-bold uppercase tracking-[0.15em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-lg shadow-[#1fe0bb]/20"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Explore Collections
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderSummaryCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </main>

        <FooterColumn />
      </div>
    </div>
  );
}
