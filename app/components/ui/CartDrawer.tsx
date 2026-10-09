"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  removeCartItem,
  setCartItemQuantity,
  useCart,
} from "@/app/context/CartStore";
import { getCartLineKey } from "@/app/lib/cart-utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount } = useCart();

  const contactAboutCart = () => {
    const orderLines = items
      .map((item) => `${item.quantity} × ${item.name} (${item.price})`)
      .join("\n");
    const message = `Hello VINI VICI VIDI Atelier, I would like help ordering:\n${orderLines}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close shopping bag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] cursor-default bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-[#E6F2EA]/20 bg-[#0B4A3B] text-white shadow-2xl"
          >
            <div className="relative isolate flex items-center justify-between overflow-hidden border-b border-white/15 bg-gradient-to-r from-[#0B4A3B] to-[#1F7A5C] p-5 sm:p-6">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="cart-header-jewelry-pattern"
                    width="64"
                    height="64"
                    patternUnits="userSpaceOnUse"
                  >
                    <polygon
                      points="32,2 62,32 32,62 2,32"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="0.85"
                      opacity="0.22"
                    />
                    <polygon
                      points="32,14 50,32 32,50 14,32"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="0.65"
                      opacity="0.16"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="64"
                      y2="64"
                      stroke="#FFFFFF"
                      strokeWidth="0.45"
                      opacity="0.14"
                    />
                    <line
                      x1="64"
                      y1="0"
                      x2="0"
                      y2="64"
                      stroke="#FFFFFF"
                      strokeWidth="0.45"
                      opacity="0.14"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="1.5"
                      fill="#FFFFFF"
                      opacity="0.35"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#cart-header-jewelry-pattern)"
                />
              </svg>
              <div className="relative z-10 flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#1fe0bb]" />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
                    Shopping Bag
                  </h2>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-widest text-white/65">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shopping bag"
                className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-9 w-9 text-white/35" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wider">
                    Your bag is empty
                  </p>
                  <Link
                    href="/rings"
                    onClick={onClose}
                    className="mt-5 rounded-full border border-white/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-white/10"
                  >
                    Browse jewellery
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const lineKey = getCartLineKey(item);
                  return (
                    <div
                      key={lineKey}
                      className="flex gap-3 rounded-xl border border-white/15 bg-black/15 p-3"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={onClose}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={onClose}
                            className="line-clamp-2 text-xs font-semibold leading-relaxed hover:text-emerald-200"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeCartItem(lineKey)}
                            aria-label={`Remove ${item.name} from bag`}
                            className="shrink-0 p-1 text-white/55 transition-colors hover:text-rose-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {Object.entries(item.selectedOptions).length > 0 && (
                          <p className="mt-1 text-[0.62rem] text-white/65">
                            {Object.entries(item.selectedOptions)
                              .map(([option, value]) => `${option}: ${value}`)
                              .join(" · ")}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-emerald-100">
                            {item.price}
                          </span>
                          <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-1.5 py-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                setCartItemQuantity(lineKey, item.quantity - 1)
                              }
                              aria-label={`Decrease ${item.name} quantity`}
                              className="grid h-7 w-7 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-5 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setCartItemQuantity(lineKey, item.quantity + 1)
                              }
                              aria-label={`Increase ${item.name} quantity`}
                              className="grid h-7 w-7 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/15 bg-black/20 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-5">
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex min-h-11 items-center justify-center rounded-full border border-white/25 px-3 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-white/10 active:scale-98"
                  >
                    View full cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex min-h-11 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-700 px-3 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-emerald-600 active:scale-98"
                  >
                    Checkout
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={contactAboutCart}
                  className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#1fe0bb] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#03251c] transition-colors hover:bg-emerald-200 active:scale-98"
                >
                  Enquire about bag via WhatsApp
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
