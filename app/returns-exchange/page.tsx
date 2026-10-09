"use client";
import { motion } from "framer-motion";
import { PageLayout } from "@/app/components/ui/PageLayout";

const SECTIONS = [
  {
    title: "Eligibility for Returns",
    content: "[CLIENT TO PROVIDE — Time window (e.g., 7 days), condition requirements (unworn, original packaging), non-returnable items (e.g., custom/engraved pieces).]",
  },
  {
    title: "Exchange Policy",
    content: "[CLIENT TO PROVIDE — How to initiate an exchange, size exchanges, product substitution policy.]",
  },
  {
    title: "How to Initiate a Return",
    content: "[CLIENT TO PROVIDE — Step-by-step process: contact email/WhatsApp, return authorisation, shipping instructions.]",
  },
  {
    title: "Refund Process",
    content: "[CLIENT TO PROVIDE — Refund timeline (e.g., 5–7 business days), mode of refund (original payment method / store credit).]",
  },
  {
    title: "Damaged or Defective Items",
    content: "[CLIENT TO PROVIDE — Procedure for reporting damage, photo evidence requirement, resolution timeline.]",
  },
];

export default function ReturnsExchangePage() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Policies</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Returns &amp; Exchange
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
