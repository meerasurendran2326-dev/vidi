"use client";
import { motion } from "framer-motion";
import { PageLayout } from "@/app/components/ui/PageLayout";

const TIPS = [
  {
    title: "Storing Your Jewellery",
    content: "Store each piece separately in a soft cloth pouch or the original branded box to prevent scratching. Keep your jewellery away from moisture, direct sunlight, and extreme temperatures.",
  },
  {
    title: "Cleaning Gold & Silver Jewellery",
    content: "Gently clean with a soft, lint-free cloth after each wear to remove oils and perspiration. For a deeper clean, use warm soapy water and a very soft brush, then pat dry thoroughly.",
  },
  {
    title: "Caring for Gemstones",
    content: "[CLIENT TO PROVIDE — Specific care instructions for featured gemstones (e.g., diamonds, rubies, emeralds, pearls).]",
  },
  {
    title: "What to Avoid",
    content: "Remove your jewellery before swimming, exercising, applying perfume, hairspray, or lotions. Chemicals and chlorine can damage both metals and gemstones.",
  },
  {
    title: "Professional Cleaning",
    content: "[CLIENT TO PROVIDE — Recommended cleaning frequency, professional re-polishing / re-plating services offered.]",
  },
  {
    title: "Repairs & Resizing",
    content: "[CLIENT TO PROVIDE — In-house or partner repair service, contact details, turnaround time.]",
  },
];

export default function JewelleryCare() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Guides</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Jewellery Care Guide</h1>
        </motion.div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-6">
        {TIPS.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-6 border border-[#0B4A3B]/5 shadow-sm"
          >
            <h2 className="text-base font-medium text-[#0B4A3B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{tip.title}</h2>
            <p className="text-sm text-[#0B4A3B]/65 leading-relaxed">{tip.content}</p>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
