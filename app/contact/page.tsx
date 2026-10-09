"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { PageLayout } from "@/app/components/ui/PageLayout";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to a real contact API
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</h1>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
          <h2 className="text-2xl font-light text-[#0B4A3B]" style={{ fontFamily: "'Playfair Display', serif" }}>We&apos;d love to hear from you</h2>
          <p className="text-[#0B4A3B]/60 leading-relaxed text-sm">For enquiries about our pieces, bespoke orders, or any assistance, reach us through the details below or send us a message.</p>
          {[
            { Icon: Phone, label: "Phone", value: "[CLIENT TO PROVIDE]" },
            { Icon: Mail, label: "Email", value: "[CLIENT TO PROVIDE]" },
            { Icon: MapPin, label: "Address", value: "[CLIENT TO PROVIDE]" },
            { Icon: MessageSquare, label: "WhatsApp", value: "[CLIENT TO PROVIDE]" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0B4A3B]/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#0B4A3B]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#C6A96C] mb-0.5">{label}</p>
                <p className="text-sm text-[#0B4A3B]/70">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#0B4A3B]/10 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-[#0B4A3B]" />
              </div>
              <h3 className="text-xl font-light text-[#0B4A3B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent</h3>
              <p className="text-sm text-[#0B4A3B]/60">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm border border-[#0B4A3B]/5">
              {[
                { id: "name", label: "Your Name", type: "text" },
                { id: "email", label: "Email Address", type: "email" },
                { id: "subject", label: "Subject", type: "text" },
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <label className="text-xs uppercase tracking-widest text-[#0B4A3B]/50 block mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    value={form[id as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#0B4A3B]/15 rounded-xl text-sm text-[#0B4A3B] focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs uppercase tracking-widest text-[#0B4A3B]/50 block mb-1.5">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#0B4A3B]/15 rounded-xl text-sm text-[#0B4A3B] focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0B4A3B] text-white text-sm rounded-xl hover:bg-[#1a6b55] transition-colors disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}
