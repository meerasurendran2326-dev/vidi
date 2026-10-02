"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Diamond } from "lucide-react";

interface MotionMarqueeProps {
  speed?: number;
  reverse?: boolean;
}

const marqueeItems = [
  "PURE 925 STERLING SILVER",
  "BESPOKE ATELIER CREATIONS",
  "VINI VICI VIDI",
  "HANDCRAFTED PERFECTION",
  "UNRIVALED BRILLIANCE",
  "ETHICALLY SOURCED GEMS",
  "HAUTE JOAILLERIE",
  "TIMELESS MASTERPIECES",
];

export default function MotionMarquee({ speed = 25, reverse = false }: MotionMarqueeProps) {
  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-[#1fe0bb]/20 bg-gradient-to-r from-[#01140E] via-[#04281D] to-[#01140E] select-none">
      {/* Edge gradient masks for seamless fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#01140E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#01140E] to-transparent z-10 pointer-events-none" />

      {/* Floating Animated Track */}
      <div className="flex w-max">
        <motion.div
          animate={{
            x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-10 sm:gap-14 whitespace-nowrap will-change-transform"
        >
          {/* Double list for infinite loop */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8 group">
              <span
                className="text-[0.68rem] sm:text-xs tracking-[0.28em] uppercase font-bold text-white/80 group-hover:text-[#1fe0bb] transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item}
              </span>
              <div className="flex items-center gap-1.5 text-[#1fe0bb]/70">
                <Diamond className="w-2.5 h-2.5 text-[#1fe0bb] fill-[#1fe0bb]/40" />
                <Sparkles className="w-2.5 h-2.5 text-white/50" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
