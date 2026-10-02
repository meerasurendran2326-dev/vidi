"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Diamond } from "lucide-react";

export default function HeroMotionVisual() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[560px] lg:h-[560px] flex items-center justify-center"
      >
        {/* Deep Radiant Emerald Core Aura */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-[#021811] via-[#1fe0bb]/35 to-[#0B4A3B]/45 blur-[80px] pointer-events-none"
        />

        {/* Concentric Orbital Motion Ring 1 - Outermost Clockwise */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-[#1fe0bb]/25 pointer-events-none"
        >
          {/* Orbiting Emerald Gemstones */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1fe0bb] shadow-[0_0_16px_#1fe0bb] border border-white flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#E6F2EA] shadow-[0_0_12px_#E6F2EA] border border-[#0B4A3B]" />
        </motion.div>

        {/* Concentric Orbital Motion Ring 2 - Mid Counter-Clockwise */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 sm:inset-12 rounded-full border border-[#E6F2EA]/20 pointer-events-none"
          style={{
            borderImage: "linear-gradient(to right, #1fe0bb, transparent, #E6F2EA, transparent) 1",
          }}
        >
          {/* High Jewellery Orbit Marker Points */}
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-white shadow-[0_0_14px_#ffffff]" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#1fe0bb] shadow-[0_0_14px_#1fe0bb]" />
        </motion.div>

        {/* Concentric Orbital Motion Ring 3 - Tilted 3D Ring with Shimmer */}
        <motion.div
          animate={{
            rotateZ: [0, 360],
            rotateX: [65, 75, 65],
          }}
          transition={{
            rotateZ: { duration: 22, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-4 sm:inset-6 rounded-full border-2 border-[#1fe0bb]/40 shadow-[0_0_35px_rgba(31,224,187,0.25)] pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-white to-[#1fe0bb] shadow-[0_0_20px_#1fe0bb] border border-white" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#0B4A3B] border border-[#1fe0bb] shadow-[0_0_12px_#1fe0bb]" />
        </motion.div>

        {/* Centerpiece Monogram Crest with 3D Depth */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transform: "translateZ(50px)" }}
          className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-9 rounded-full bg-[#01140E]/85 border border-[#1fe0bb]/45 shadow-[0_0_50px_rgba(11,74,59,0.7)] backdrop-blur-xl"
        >
          {/* Shimmer Light Bar passing across */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: ["-150%", "200%"],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
              className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            />
          </div>

          {/* Central Gem Icon */}
          <div className="relative mb-2">
            <Diamond className="w-8 h-8 sm:w-11 sm:h-11 text-[#1fe0bb] drop-shadow-[0_0_14px_#1fe0bb]" />
            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-white animate-spin" style={{ animationDuration: "5s" }} />
          </div>

          {/* Roman Monogram */}
          <span
            className="text-lg sm:text-2xl font-black tracking-[0.25em] bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VVV
          </span>

          <span className="text-[0.52rem] sm:text-[0.58rem] tracking-[0.3em] text-[#1fe0bb] uppercase font-bold mt-1">
            925 ATELIER
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
