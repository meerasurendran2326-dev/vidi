"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, CheckCircle, Truck, MapPin, Clock } from "lucide-react";
import { PageLayout } from "@/app/components/ui/PageLayout";

interface TrackResult {
  orderId: string;
  orderNumber?: string;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
  destinationCity?: string;
  destinationState?: string;
  items: { name: string; quantity: number; variant?: Record<string, string> }[];
}

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Payment Confirmed",
  PROCESSING: "Atelier Crafting & Pack",
  SHIPPED: "Dispatched & In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Payment Failed",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !contact.trim()) {
      setError("Please provide both your Order ID and the Email or Phone used during checkout.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId.trim(),
          contact: contact.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Order not found. Please verify your details.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to locate order. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = result ? STATUS_STEPS.indexOf(result.status) : -1;

  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Atelier Concierge</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Track Your Order
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-md mx-auto">
            Enter your order reference and contact details to check the live fulfillment and delivery status.
          </p>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Secure Form */}
        <form onSubmit={handleTrack} className="bg-white rounded-2xl p-6 shadow-sm border border-[#0B4A3B]/10 space-y-4 mb-8">
          <div>
            <label className="text-xs uppercase tracking-widest text-[#0B4A3B]/60 block mb-1.5 font-medium">
              Order ID / Number
            </label>
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. VVV-0001 or order ID"
              className="w-full px-4 py-3 border border-[#0B4A3B]/20 rounded-xl text-sm text-[#0B4A3B] focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20 bg-white"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[#0B4A3B]/60 block mb-1.5 font-medium">
              Email or Phone Number
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="The email or 10-digit phone used at checkout"
              className="w-full px-4 py-3 border border-[#0B4A3B]/20 rounded-xl text-sm text-[#0B4A3B] focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0B4A3B] text-white rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-[#1a6b55] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-[#0B4A3B]/20"
          >
            <Search className="w-4 h-4" />
            {loading ? "Verifying & Locating…" : "Track Order"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#0B4A3B]/10 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#0B4A3B]/10 pb-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#C6A96C] font-semibold">
                    Order Reference
                  </p>
                  <p className="text-base font-bold text-[#0B4A3B]">
                    {result.orderNumber ? `#${result.orderNumber}` : result.orderId}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0B4A3B]/10 text-[#0B4A3B]">
                    {STATUS_LABELS[result.status] ?? result.status}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              {!["CANCELLED", "FAILED"].includes(result.status) && (
                <div className="py-4">
                  <div className="flex items-center justify-between relative mb-2">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0B4A3B]/10 w-full z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1fe0bb] z-0 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%`,
                      }}
                    />
                    {STATUS_STEPS.map((step, idx) => {
                      const isDone = idx <= currentStep;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isDone
                                ? "bg-[#0B4A3B] text-[#1fe0bb]"
                                : "bg-white border-2 border-[#0B4A3B]/20 text-[#0B4A3B]/40"
                            }`}
                          >
                            {isDone ? "✓" : idx + 1}
                          </div>
                          <span className="text-[0.62rem] uppercase tracking-wider text-[#0B4A3B]/70 mt-1 font-medium hidden sm:block">
                            {step.toLowerCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="border-t border-[#0B4A3B]/10 pt-4 mt-2">
                <p className="text-xs uppercase tracking-wider text-[#0B4A3B]/60 font-semibold mb-2">
                  Items In Shipment
                </p>
                <div className="space-y-2">
                  {result.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-[#0B4A3B]/5 last:border-0">
                      <span className="text-[#0B4A3B] font-medium">{it.name}</span>
                      <span className="text-[#0B4A3B]/70">Qty: {it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.destinationCity && (
                <div className="border-t border-[#0B4A3B]/10 pt-3 mt-3 flex items-center gap-2 text-xs text-[#0B4A3B]/70">
                  <MapPin className="w-3.5 h-3.5 text-[#1fe0bb]" />
                  <span>Destination: {result.destinationCity}, {result.destinationState}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
