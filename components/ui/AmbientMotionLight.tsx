"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function AmbientMotionLight() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen"
    >
      {/* Primary Emerald/Silver Fluid Follower */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full bg-radial from-[#1fe0bb]/14 via-[#0B4A3B]/10 to-transparent blur-[70px] pointer-events-none"
      />

      {/* Secondary Silver Apex Accent */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-[80px] h-[80px] rounded-full bg-radial from-white/20 via-[#1fe0bb]/20 to-transparent blur-[25px] pointer-events-none"
      />
    </div>
  );
}
