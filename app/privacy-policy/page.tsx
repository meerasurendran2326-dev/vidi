"use client";
import { motion } from "framer-motion";
import { PageLayout } from "@/app/components/ui/PageLayout";

const SECTIONS = [
  { title: "1. Information We Collect", content: "[CLIENT TO PROVIDE — Types of data collected: name, email, address, payment info, browsing data, cookies.]" },
  { title: "2. How We Use Your Information", content: "[CLIENT TO PROVIDE — Order fulfilment, communication, marketing (opt-in), analytics, fraud prevention.]" },
  { title: "3. Data Sharing", content: "[CLIENT TO PROVIDE — Third parties (payment gateway, logistics, analytics), no sale of personal data.]" },
  { title: "4. Cookies", content: "[CLIENT TO PROVIDE — Types of cookies used, opt-out method, cookie consent mechanism.]" },
  { title: "5. Data Retention", content: "[CLIENT TO PROVIDE — Retention periods, deletion on request process.]" },
  { title: "6. Your Rights", content: "[CLIENT TO PROVIDE — Right to access, correct, delete data; how to exercise rights; Data Protection Officer contact.]" },
  { title: "7. Security", content: "We implement industry-standard security measures including SSL/TLS encryption, PCI DSS-compliant payment processing via Razorpay, and restricted data access controls." },
  { title: "8. Contact", content: "[CLIENT TO PROVIDE — DPO email, postal address for privacy queries.]" },
];

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</h1>
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
