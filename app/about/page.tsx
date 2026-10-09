"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/app/components/ui/PageLayout";

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>About Vini Vici Vidi</h1>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-light text-[#0B4A3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Who We Are</h2>
          <p className="text-[#0B4A3B]/70 leading-relaxed">[CLIENT TO PROVIDE — Brand story, founding year, vision, and values.]</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-light text-[#0B4A3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Craft</h2>
          <p className="text-[#0B4A3B]/70 leading-relaxed">[CLIENT TO PROVIDE — Materials sourcing, craftsmanship process, artisan story.]</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-light text-[#0B4A3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Promise</h2>
          <p className="text-[#0B4A3B]/70 leading-relaxed">[CLIENT TO PROVIDE — Quality guarantee, ethical sourcing, customer commitment.]</p>
        </motion.section>
      </div>
    </PageLayout>
  );
}
