import { Check, Clock3, Package, Sparkles, Truck } from "lucide-react";
import type { OrderStatusType } from "./OrderStatusBadge";

interface OrderTimelineProps {
  status: OrderStatusType | string;
  className?: string;
}

const STAGES = [
  {
    key: "CONFIRMED",
    title: "Confirmed",
    description: "Order verified & accepted by atelier",
    icon: Check,
  },
  {
    key: "PROCESSING",
    title: "Processing",
    description: "Handcrafting, finishing & inspection",
    icon: Package,
  },
  {
    key: "SHIPPED",
    title: "Shipped",
    description: "Dispatched with insured courier",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    description: "Safely received by customer",
    icon: Sparkles,
  },
] as const;

function getStageIndex(status: string): number {
  const norm = status.toUpperCase();
  if (norm === "DELIVERED" || norm === "COMPLETED") return 3;
  if (norm === "SHIPPED") return 2;
  if (norm === "PROCESSING") return 1;
  if (norm === "CONFIRMED") return 0;
  return -1;
}

export function OrderTimeline({ status, className = "" }: OrderTimelineProps) {
  const isCancelled = status.toUpperCase() === "CANCELLED";
  const currentIndex = getStageIndex(status);

  if (isCancelled) {
    return (
      <div
        className={`rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-center backdrop-blur-md ${className}`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
          Order Status
        </p>
        <h3
          className="mt-1 text-xl font-medium text-white"
          style={{ fontFamily: "var(--font-editorial), serif" }}
        >
          This order has been cancelled
        </h3>
        <p className="mt-2 text-xs text-rose-200/70">
          If you have questions regarding this order or refunds, please contact
          concierge support.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-emerald-400/20 bg-[#061812]/80 p-6 shadow-xl backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#1fe0bb]">
            Fulfillment Journey
          </span>
          <h3
            className="text-lg font-medium text-white sm:text-xl"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            Order Status
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-200/70">
          <Clock3 className="h-4 w-4 text-[#1fe0bb]" />
          <span>Real-time tracking</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative mt-8">
        {/* Desktop timeline horizontal */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-4 relative">
          {/* Progress bar line */}
          <div
            aria-hidden="true"
            className="absolute top-5 left-[12%] right-[12%] h-[2px] bg-white/10 -z-0"
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-[#1fe0bb] to-emerald-400 transition-all duration-700"
              style={{
                width: `${currentIndex >= 0 ? Math.min(100, (currentIndex / (STAGES.length - 1)) * 100) : 0}%`,
              }}
            />
          </div>

          {STAGES.map((stage, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
                    isCurrent
                      ? "border-[#1fe0bb] bg-[#0B4A3B] text-[#1fe0bb] shadow-lg shadow-[#1fe0bb]/30 scale-110"
                      : isCompleted
                        ? "border-emerald-400 bg-emerald-900/60 text-emerald-300"
                        : "border-white/15 bg-[#01160F] text-white/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h4
                  className={`mt-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    isCurrent
                      ? "text-[#1fe0bb]"
                      : isCompleted
                        ? "text-white"
                        : "text-white/40"
                  }`}
                >
                  {stage.title}
                </h4>
                <p className="mt-1 text-[0.68rem] leading-relaxed text-emerald-100/60 max-w-[150px]">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile timeline vertical */}
        <div className="sm:hidden space-y-6 relative pl-6 border-l-2 border-white/10 ml-4">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[-2px] w-[2px] bg-gradient-to-b from-[#1fe0bb] via-emerald-400 to-transparent"
            style={{
              height: `${currentIndex >= 0 ? Math.min(100, ((currentIndex + 1) / STAGES.length) * 100) : 0}%`,
            }}
          />

          {STAGES.map((stage, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-[35px] grid h-8 w-8 place-items-center rounded-full border transition-all ${
                    isCurrent
                      ? "border-[#1fe0bb] bg-[#0B4A3B] text-[#1fe0bb] shadow-md shadow-[#1fe0bb]/40"
                      : isCompleted
                        ? "border-emerald-400 bg-emerald-900/60 text-emerald-300"
                        : "border-white/20 bg-[#01160F] text-white/30"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="pt-0.5">
                  <h4
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isCurrent
                        ? "text-[#1fe0bb]"
                        : isCompleted
                          ? "text-white"
                          : "text-white/40"
                    }`}
                  >
                    {stage.title}
                  </h4>
                  <p className="mt-0.5 text-[0.7rem] text-emerald-100/60">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
