import type { CartLine } from "@/app/lib/cart-utils";
import { formatPrice, getCartSubtotal } from "@/app/lib/cart-utils";

interface CartOrderSummaryProps {
  items: CartLine[];
}

const SHIPPING_PLACEHOLDER = 0;

export function CartOrderSummary({ items }: CartOrderSummaryProps) {
  const subtotal = getCartSubtotal(items);
  const total = subtotal + SHIPPING_PLACEHOLDER;

  return (
    <section
      aria-labelledby="cart-order-summary-title"
      className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-4 shadow-xl shadow-black/25 backdrop-blur-xl sm:p-6"
    >
      <h2
        id="cart-order-summary-title"
        className="text-sm font-bold uppercase tracking-[0.18em] text-white"
      >
        Order Summary
      </h2>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4 text-emerald-100/75">
          <dt>Subtotal</dt>
          <dd className="font-semibold text-white">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 text-emerald-100/75">
          <dt>Shipping estimate</dt>
          <dd className="font-semibold text-white">
            {formatPrice(SHIPPING_PLACEHOLDER)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-white/50">
        Shipping is a placeholder and will be confirmed by the atelier.
      </p>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-white">
          Grand total
        </span>
        <span className="text-xl font-bold text-emerald-200">
          {formatPrice(total)}
        </span>
      </div>
    </section>
  );
}
