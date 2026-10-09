"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PageLayout } from "@/app/components/ui/PageLayout";

const FAQS = [
  {
    q: "What materials are used in your jewellery?",
    a: "[CLIENT TO PROVIDE — e.g., 22K/18K gold, sterling silver, gemstone grades, hallmark details.]",
  },
  {
    q: "Are your pieces hallmarked and certified?",
    a: "[CLIENT TO PROVIDE — certification bodies, hallmark details, authenticity cards.]",
  },
  {
    q: "How do I find the right ring/bracelet size?",
    a: "Please refer to our Size Guide page for detailed measurement instructions.",
  },
  {
    q: "Do you offer bespoke / custom jewellery?",
    a: "[CLIENT TO PROVIDE — Custom order process, lead times, minimum order value.]",
  },
  {
    q: "What is your return and exchange policy?",
    a: "Please refer to our Returns & Exchange Policy page for full details.",
  },
  {
    q: "How long does shipping take?",
    a: "Please refer to our Shipping Policy page for estimated delivery timelines.",
  },
  {
    q: "Do you ship internationally?",
    a: "[CLIENT TO PROVIDE — list of countries, international duties/taxes note.]",
  },
  {
    q: "How do I care for my jewellery?",
    a: "Visit our Jewellery Care Guide for tips on cleaning, storing, and maintaining your pieces.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. All transactions are processed through Razorpay, a PCI DSS-compliant payment gateway. We never store your card details.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order is shipped you will receive a tracking link by email. You can also visit the Track Order page on our site.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0B4A3B]/10 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-[#0B4A3B] pr-4">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <ChevronDown className="w-4 h-4 text-[#0B4A3B]/50" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#0B4A3B]/65 leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Support</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Frequently Asked Questions
          </h1>
        </motion.div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-[#0B4A3B]/5 divide-y divide-[#0B4A3B]/10 px-6">
          {FAQS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
