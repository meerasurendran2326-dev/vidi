"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CheckoutForm } from "@/app/components/ui/CheckoutForm";
import { CheckoutOrderSummary } from "@/app/components/ui/CheckoutOrderSummary";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { useCart } from "@/app/context/CartStore";
import { ShaderBackground } from "@/components/ui/adisyon-shader";

export default function CheckoutPage() {
  const { items, itemCount } = useCart();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020704] text-slate-100">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="h-full w-full opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 px-3.5 py-6 sm:px-8 sm:py-12 lg:px-12">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
          <div className="mt-7 border-b border-emerald-300/20 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Vini Vici Vidi · Silver Atelier
            </p>
            <h1
              className="mt-2 text-3xl font-semibold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-editorial), serif" }}
            >
              Checkout
            </h1>
            <p className="mt-2 text-sm text-emerald-100/65">
              Complete your details for {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}.
            </p>
          </div>

          {items.length === 0 ? (
            <section className="my-10 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-emerald-300/15 bg-[#06130e]/65 px-6 text-center">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Your bag is empty
              </h2>
              <p className="mt-2 text-sm text-emerald-100/65">
                Add a creation to your bag before checkout.
              </p>
              <Link
                href="/rings"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-emerald-600"
              >
                Browse jewellery
              </Link>
            </section>
          ) : (
            <div className="mt-7 grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
              <CheckoutForm items={items} />

              <aside className="lg:sticky lg:top-28">
                <CheckoutOrderSummary items={items} />
              </aside>
            </div>
          )}
        </main>
        <FooterColumn />
      </div>
    </div>
  );
}
