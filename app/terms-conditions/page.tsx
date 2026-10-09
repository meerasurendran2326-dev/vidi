"use client";
import { motion } from "framer-motion";
import { PageLayout } from "@/app/components/ui/PageLayout";

const SECTIONS = [
  { title: "1. Acceptance of Terms", content: "[CLIENT TO PROVIDE — Statement that use of the site constitutes agreement to these terms.]" },
  { title: "2. Products & Pricing", content: "[CLIENT TO PROVIDE — Accuracy of product descriptions, pricing errors policy, right to cancel orders with incorrect pricing.]" },
  { title: "3. Order Acceptance", content: "[CLIENT TO PROVIDE — When an order is confirmed, right to refuse or cancel orders, fraud prevention.]" },
  { title: "4. Payment", content: "All payments are processed securely through Razorpay. By placing an order, you authorise us to charge the total amount to your selected payment method." },
  { title: "5. Intellectual Property", content: "[CLIENT TO PROVIDE — Ownership of all brand assets, images, copy, and designs on the site.]" },
  { title: "6. Limitation of Liability", content: "[CLIENT TO PROVIDE — Cap on liability, disclaimer for indirect/consequential damages.]" },
  { title: "7. Governing Law", content: "[CLIENT TO PROVIDE — Jurisdiction (e.g., Maharashtra, India), dispute resolution mechanism.]" },
  { title: "8. Amendments", content: "[CLIENT TO PROVIDE — Right to update terms, notification policy, continued use as acceptance.]" },
  { title: "9. Contact", content: "[CLIENT TO PROVIDE — Email/postal address for legal queries.]" },
];

export default function TermsConditionsPage() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Terms &amp; Conditions</h1>
        </motion.div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        {SECTIONS.map((s, i) => (
          <motion.section key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <h2 className="text-lg font-medium text-[#0B4A3B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{s.title}</h2>
            <p className="text-sm text-[#0B4A3B]/70 leading-relaxed">{s.content}</p>
          </motion.section>
        ))}
        <p className="text-xs text-[#0B4A3B]/40 pt-4">Last updated: [CLIENT TO PROVIDE DATE]</p>
      </div>
    </PageLayout>
  );
}
