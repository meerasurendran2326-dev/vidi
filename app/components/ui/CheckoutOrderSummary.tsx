import Image from "next/image";
import type { CartLine } from "@/app/lib/cart-utils";
import {
  formatPrice,
  getCartSubtotal,
  getLineAmount,
} from "@/app/lib/cart-utils";

interface CheckoutOrderSummaryProps {
  items: CartLine[];
}

const SHIPPING_PLACEHOLDER = 0;

export function CheckoutOrderSummary({ items }: CheckoutOrderSummaryProps) {
  const subtotal = getCartSubtotal(items);

  return (
    <aside className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-4 shadow-xl shadow-black/25 backdrop-blur-xl sm:p-6 lg:sticky lg:top-28">
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
        Order Summary
      </h2>
      <div className="mt-5 max-h-[min(42vh,420px)] space-y-3 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <article
            key={`${item.productId}-${index}`}
            className="flex gap-3 border-b border-white/10 pb-3 last:border-b-0"
          >
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border border-emerald-300/15 bg-emerald-950/60">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-300 px-1 text-[0.62rem] font-bold text-[#03251c]">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-semibold leading-snug text-white line-clamp-2">
                {item.name}
              </h3>
              {Object.entries(item.selectedOptions).length > 0 && (
                <p className="mt-1 text-xs text-emerald-100/60">
                  {Object.entries(item.selectedOptions)
                    .map(([option, value]) => `${option}: ${value}`)
                    .join(" · ")}
                </p>
              )}
              <p className="mt-1 text-xs text-emerald-100/70">{item.price}</p>
            </div>
            <p className="self-center whitespace-nowrap text-xs font-semibold text-white">
              {formatPrice(getLineAmount(item))}
            </p>
          </article>
        ))}
      </div>

      <dl className="mt-4 space-y-3 border-t border-white/15 pt-4 text-sm">
        <div className="flex items-center justify-between gap-4 text-emerald-100/75">
          <dt>Subtotal</dt>
          <dd className="font-semibold text-white">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 text-emerald-100/75">
          <dt>Shipping</dt>
          <dd className="font-semibold text-white">
            {SHIPPING_PLACEHOLDER === 0
              ? "Calculated later"
              : formatPrice(SHIPPING_PLACEHOLDER)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-xs leading-relaxed text-white/45">
        Shipping will be confirmed by the atelier.
      </p>
      <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-white">
          Grand total
        </span>
        <span className="text-lg font-bold text-emerald-200">
          {formatPrice(subtotal + SHIPPING_PLACEHOLDER)}
        </span>
      </div>
    </aside>
  );
}
