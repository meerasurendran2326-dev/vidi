"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { CartOrderSummary } from "@/app/components/ui/CartOrderSummary";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import {
  clearCart,
  removeCartItem,
  setCartItemQuantity,
  useCart,
} from "@/app/context/CartStore";
import {
  formatPrice,
  getCartLineKey,
  getCatalogProduct,
  getLineAmount,
} from "@/app/lib/cart-utils";
import { ShaderBackground } from "@/components/ui/adisyon-shader";

export default function CartPage() {
  const { items, itemCount } = useCart();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020704] text-slate-100">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="h-full w-full opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <Link
            href="/rings"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>

          <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-b border-emerald-300/20 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Vini Vici Vidi · Silver Atelier
              </p>
              <h1
                className="mt-2 text-3xl font-semibold text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-editorial), serif" }}
              >
                Your Shopping Bag
              </h1>
              <p className="mt-2 text-sm text-emerald-100/65">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-rose-300"
              >
                <Trash2 className="h-4 w-4" />
                Clear cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <section className="my-10 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald-300/15 bg-[#06130e]/65 px-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Your bag is empty
              </p>
              <p className="mt-2 max-w-sm text-sm text-emerald-100/65">
                Explore the atelier collections and add a piece to your bag.
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
              <section aria-label="Cart items" className="space-y-3">
                {items.map((item) => {
                  const lineKey = getCartLineKey(item);
                  const product = getCatalogProduct(item.productId);
                  const maximumReached =
                    product?.stock !== undefined &&
                    item.quantity >= product.stock;

                  return (
                    <article
                      key={lineKey}
                      className="flex gap-4 rounded-2xl border border-emerald-300/15 bg-[#06130e]/75 p-3 shadow-lg shadow-black/20 backdrop-blur-md sm:gap-5 sm:p-4"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl border border-emerald-300/15 bg-emerald-950/60 sm:w-32"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 96px, 128px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 py-1 sm:flex-row sm:items-center">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-semibold leading-relaxed text-white transition-colors hover:text-emerald-200 sm:text-base"
                          >
                            {item.name}
                          </Link>
                          {Object.entries(item.selectedOptions).length > 0 && (
                            <p className="mt-1 text-xs text-emerald-100/60">
                              {Object.entries(item.selectedOptions)
                                .map(([option, value]) => `${option}: ${value}`)
                                .join(" · ")}
                            </p>
                          )}
                          <p className="mt-2 text-sm font-bold text-emerald-200">
                            {item.price}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <div className="inline-flex items-center rounded-full border border-white/20 bg-black/20">
                            <button
                              type="button"
                              onClick={() =>
                                setCartItemQuantity(lineKey, item.quantity - 1)
                              }
                              aria-label={`Decrease ${item.name} quantity`}
                              className="grid h-9 w-9 place-items-center text-white/75 transition-colors hover:text-emerald-200"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span
                              className="min-w-8 text-center text-sm font-semibold"
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCartItemQuantity(lineKey, item.quantity + 1)
                              }
                              disabled={maximumReached}
                              aria-label={`Increase ${item.name} quantity`}
                              className="grid h-9 w-9 place-items-center text-white/75 transition-colors hover:text-emerald-200 disabled:opacity-40"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="min-w-20 text-right text-sm font-semibold text-white">
                            {formatPrice(getLineAmount(item))}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCartItem(lineKey)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="grid h-9 w-9 place-items-center rounded-full text-white/55 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              <aside className="lg:sticky lg:top-28">
                <CartOrderSummary items={items} />
                <Link
                  href="/checkout"
                  className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-[#1fe0bb] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#03251c] shadow-lg transition-colors hover:bg-emerald-200"
                >
                  Proceed to Checkout
                </Link>
                <p className="mt-3 text-center text-xs text-white/45">
                  Checkout is a frontend order review; payment is not connected.
                </p>
              </aside>
            </div>
          )}
        </main>
        <FooterColumn />
      </div>
    </div>
  );
}
