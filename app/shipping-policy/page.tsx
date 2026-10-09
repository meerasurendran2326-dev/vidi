"use client";
import { motion } from "framer-motion";
import { PageLayout } from "@/app/components/ui/PageLayout";

const SECTIONS = [
  {
    title: "Standard Shipping",
    content: "[CLIENT TO PROVIDE — Delivery timelines, courier partners, trackable shipments, expected ETA for metro vs. non-metro cities.]",
  },
  {
    title: "Express Shipping",
    content: "[CLIENT TO PROVIDE — Express delivery availability, additional charges, cut-off time for same-day dispatch.]",
  },
  {
    title: "Free Shipping Threshold",
    content: "[CLIENT TO PROVIDE — Minimum cart value for complimentary shipping.]",
  },
  {
    title: "International Shipping",
    content: "[CLIENT TO PROVIDE — Countries served, estimated delivery time, customs duties responsibility.]",
  },
  {
    title: "Packaging",
    content: "Every Vini Vici Vidi piece is shipped in premium branded packaging, carefully secured to protect your jewellery during transit.",
  },
  {
    title: "Order Tracking",
    content: "Once your order is dispatched you will receive a tracking number via email. Use the Track Order page on our site to follow your delivery.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Delivery</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shipping Policy
          </h1>
        </motion.div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        {SECTIONS.map((s, i) => (
          <motion.section key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <h2 className="text-lg font-medium text-[#0B4A3B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{s.title}</h2>
            <p className="text-sm text-[#0B4A3B]/70 leading-relaxed">{s.content}</p>
          </motion.section>
        ))}
        <p className="text-xs text-[#0B4A3B]/40 pt-4">Last updated: [CLIENT TO PROVIDE DATE]</p>
      </div>
    </PageLayout>
  );
}
