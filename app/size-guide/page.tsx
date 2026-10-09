"use client";
import { motion } from "framer-motion";
import { PageLayout } from "@/app/components/ui/PageLayout";

const RING_SIZES = [
  { us: "5", uk: "J½", diameter: "15.7 mm", circumference: "49.3 mm" },
  { us: "6", uk: "L½", diameter: "16.5 mm", circumference: "51.9 mm" },
  { us: "7", uk: "N½", diameter: "17.3 mm", circumference: "54.4 mm" },
  { us: "8", uk: "P½", diameter: "18.2 mm", circumference: "57.0 mm" },
  { us: "9", uk: "R½", diameter: "19.0 mm", circumference: "59.7 mm" },
  { us: "10", uk: "T½", diameter: "19.8 mm", circumference: "62.1 mm" },
  { us: "11", uk: "V½", diameter: "20.6 mm", circumference: "64.6 mm" },
  { us: "12", uk: "X½", diameter: "21.4 mm", circumference: "67.2 mm" },
];

const BRACELET_SIZES = [
  { size: "XS", wrist: "13–14 cm", bracelet: "15–16 cm" },
  { size: "S", wrist: "14–15 cm", bracelet: "16–17 cm" },
  { size: "M", wrist: "15–17 cm", bracelet: "17–18.5 cm" },
  { size: "L", wrist: "17–18 cm", bracelet: "18.5–20 cm" },
  { size: "XL", wrist: "18–19 cm", bracelet: "20–21.5 cm" },
];

export default function SizeGuidePage() {
  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-[#0B4A3B] to-[#1a6b55] py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3">Guides</p>
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Size Guide</h1>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        {/* How to measure */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-light text-[#0B4A3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>How to Measure</h2>
          <div className="bg-white rounded-2xl p-6 border border-[#0B4A3B]/5 shadow-sm space-y-3 text-sm text-[#0B4A3B]/70 leading-relaxed">
            <p><span className="font-medium text-[#0B4A3B]">Ring:</span> Wrap a thin strip of paper or string around the base of your finger. Mark where it overlaps and measure the length — that is your circumference. Refer to the chart below.</p>
            <p><span className="font-medium text-[#0B4A3B]">Bracelet:</span> Measure the circumference of your wrist just below the wrist bone. Add 1–1.5 cm for a comfortable fit.</p>
            <p className="text-[#0B4A3B]/50 text-xs italic">Tip: Measure in the evening when fingers tend to be at their largest.</p>
          </div>
        </motion.section>

        {/* Ring size chart */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-light text-[#0B4A3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Ring Size Chart</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#0B4A3B]/10">
            <table className="w-full text-sm text-[#0B4A3B]">
              <thead className="bg-[#0B4A3B] text-white text-xs uppercase tracking-widest">
                <tr>
                  {["US Size", "UK Size", "Diameter", "Circumference"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RING_SIZES.map((r, i) => (
                  <tr key={r.us} className={i % 2 === 0 ? "bg-white" : "bg-[#F9F6F1]"}>
                    <td className="px-4 py-3">{r.us}</td>
                    <td className="px-4 py-3">{r.uk}</td>
                    <td className="px-4 py-3">{r.diameter}</td>
                    <td className="px-4 py-3">{r.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Bracelet size chart */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-light text-[#0B4A3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Bracelet Size Chart</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#0B4A3B]/10">
            <table className="w-full text-sm text-[#0B4A3B]">
              <thead className="bg-[#0B4A3B] text-white text-xs uppercase tracking-widest">
                <tr>
                  {["Size", "Wrist Circumference", "Recommended Bracelet Length"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BRACELET_SIZES.map((b, i) => (
                  <tr key={b.size} className={i % 2 === 0 ? "bg-white" : "bg-[#F9F6F1]"}>
                    <td className="px-4 py-3 font-medium">{b.size}</td>
                    <td className="px-4 py-3">{b.wrist}</td>
                    <td className="px-4 py-3">{b.bracelet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
}
