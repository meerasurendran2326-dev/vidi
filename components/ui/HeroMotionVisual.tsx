"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function HeroMotionVisual() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [12, -12]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-12, 12]),
    springConfig,
  );
  const glowX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-30, 30]),
    springConfig,
  );
  const glowY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-30, 30]),
    springConfig,
  );

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
        className="relative w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[560px] lg:h-[560px] flex items-center justify-center max-w-[90vw]"
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
      </motion.div>
    </div>
  );
}
