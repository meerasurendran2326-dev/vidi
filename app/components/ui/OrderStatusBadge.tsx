import {
  CheckCircle2,
  Clock,
  Package,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";

export type OrderStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

interface OrderStatusBadgeProps {
  status: OrderStatusType | string;
  className?: string;
  showIcon?: boolean;
}

export function OrderStatusBadge({
  status,
  className = "",
  showIcon = true,
}: OrderStatusBadgeProps) {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "CONFIRMED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-950/60 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-emerald-200 shadow-sm shadow-emerald-950/50 backdrop-blur-md ${className}`}
        >
          {showIcon && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />}
          Confirmed
        </span>
      );

    case "PROCESSING":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-cyan-200 shadow-sm shadow-cyan-950/50 backdrop-blur-md ${className}`}
        >
          {showIcon && <Package className="h-3.5 w-3.5 text-cyan-300" />}
          Processing
        </span>
      );

    case "SHIPPED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/60 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-amber-200 shadow-sm shadow-amber-950/50 backdrop-blur-md ${className}`}
        >
          {showIcon && <Truck className="h-3.5 w-3.5 text-amber-300" />}
          Shipped
        </span>
      );

    case "DELIVERED":
    case "COMPLETED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-[#1fe0bb]/50 bg-[#042e22]/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1fe0bb] shadow-sm shadow-[#1fe0bb]/20 backdrop-blur-md ${className}`}
        >
          {showIcon && <Sparkles className="h-3.5 w-3.5 text-[#1fe0bb]" />}
          Delivered
        </span>
      );

    case "CANCELLED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-950/60 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-rose-200 shadow-sm shadow-rose-950/50 backdrop-blur-md ${className}`}
        >
          {showIcon && <XCircle className="h-3.5 w-3.5 text-rose-300" />}
          Cancelled
        </span>
      );

    case "PENDING":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-400/30 bg-slate-900/60 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-300 shadow-sm shadow-black/40 backdrop-blur-md ${className}`}
        >
          {showIcon && <Clock className="h-3.5 w-3.5 text-slate-400" />}
          Pending
        </span>
      );
  }
}

export function PaymentStatusBadge({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  const normalized = status.toUpperCase();

  if (normalized === "PAID") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider text-emerald-300 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Paid
      </span>
    );
  }

  if (normalized === "PENDING" || normalized === "CREATED" || normalized === "AUTHORIZED") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider text-amber-300 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        {normalized === "AUTHORIZED" ? "Authorized" : "Payment Pending"}
      </span>
    );
  }

  if (normalized === "REFUNDED") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-950/40 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider text-sky-300 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        Refunded
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-950/40 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider text-rose-300 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
      Failed
    </span>
  );
}
