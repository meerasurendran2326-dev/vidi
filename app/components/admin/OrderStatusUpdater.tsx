"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<OrderStatus>(
    currentStatus as OrderStatus
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdate = () => {
    if (selected === currentStatus) return;
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: selected }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to update status.");
          return;
        }

        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400">
        Update Order Status
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as OrderStatus)}
          className="rounded-xl border border-emerald-900/50 bg-[#010d08] px-4 py-2 text-sm text-slate-100 focus:border-[#1fe0bb]/50 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]/30 transition-all"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          disabled={isPending || selected === currentStatus}
          className="inline-flex items-center gap-2 rounded-full bg-[#1fe0bb] px-5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#03251c] transition-all hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : "Update Status"}
        </button>
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {success && (
        <p className="text-xs text-emerald-400">Status updated successfully.</p>
      )}
    </div>
  );
}
