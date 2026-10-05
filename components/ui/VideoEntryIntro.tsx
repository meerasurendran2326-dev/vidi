"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface VideoEntryIntroProps {
  onComplete: () => void;
  isOpen?: boolean;
}

export default function VideoEntryIntro({
  onComplete,
  isOpen = true,
}: VideoEntryIntroProps) {
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth cinematic exit transition
  const handleExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  }, [isExiting, onComplete]);

  // Handle ESC or Space keys or click to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExit]);

  // Autoplay video immediately on mount
  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.currentTime = 0;
      video.playbackRate = 2.5;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay attempt:", err);
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleExit}
      className="fixed inset-0 z-[120] w-full h-full bg-black overflow-hidden flex items-center justify-center cursor-pointer select-none"
    >
      {/* 100% Fullscreen Video - No icons, pure video filling screen */}
      <video
        ref={videoRef}
        src="/vvv-logo-reveal.mp4"
        playsInline
        autoPlay
        muted
        preload="auto"
        onEnded={handleExit}
        className="w-full h-full object-cover bg-black pointer-events-none"
      />

      {/* Discrete subtle skip hint in the corner */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-white/60 font-light">
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
}
