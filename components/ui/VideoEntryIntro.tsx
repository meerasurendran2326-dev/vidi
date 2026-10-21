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
        scale: 1.01,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  }, [isExiting, onComplete]);

  // Handle ESC or Space keys or Enter to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExit]);

  // Prevent background scrolling while intro is active
  useEffect(() => {
    if (!isOpen) return;
    const prevBg = document.body.style.backgroundColor;
    const prevOverflow = document.body.style.overflow;
    document.body.style.backgroundColor = "#000000";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Instant zero-lag playback with fallback safety timer
  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.playbackRate = 1.15;

    const initiatePlayback = () => {
      if (video.paused) {
        const p = video.play();
        if (p !== undefined) {
          p.catch((err) => {
            console.warn("Autoplay attempt:", err);
          });
        }
      }
    };

    initiatePlayback();
    video.addEventListener("loadeddata", initiatePlayback, { once: true });
    video.addEventListener("canplay", initiatePlayback, { once: true });

    // Fallback timer: ensure intro never hangs even on slow networks
    const safetyTimeout = setTimeout(() => {
      handleExit();
    }, 7500);

    return () => {
      clearTimeout(safetyTimeout);
      video.removeEventListener("loadeddata", initiatePlayback);
      video.removeEventListener("canplay", initiatePlayback);
    };
  }, [isOpen, handleExit]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleExit}
      style={{
        backgroundColor: "#000000",
        backgroundImage:
          "radial-gradient(circle at 50% 50%, #031e15 0%, #01110b 45%, #000000 85%)",
        zIndex: 99999,
      }}
      className="fixed inset-0 w-screen h-[100dvh] overflow-hidden flex items-center justify-center cursor-pointer select-none"
    >
      {/* 
        High-Performance Hardware Accelerated Logo Reveal Video:
        1. Both desktop and mobile use FastStart MP4s (moov atom at beginning)
        2. Responsive <source> eliminates React re-mounting / buffering aborts
        3. Static overlay instead of heavy CSS mask-image avoids GPU composite lag
      */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        preload="auto"
        onEnded={handleExit}
        className="w-full h-full object-contain sm:object-cover pointer-events-none will-change-transform"
      >
        <source
          src="/vini-vici-vidi-mobile-logo-reveal.mp4"
          media="(max-width: 767px)"
          type="video/mp4"
        />
        <source
          src="/vvv-logo-reveal.mp4"
          type="video/mp4"
        />
      </video>

      {/* Lightweight GPU-accelerated vignette blend - zero performance cost */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-radial from-transparent via-transparent to-black/70"
      />

      {/* Discrete skip hint */}
      <div className="absolute z-20 bottom-4 right-4 sm:bottom-6 sm:right-8 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-white/70 font-light drop-shadow-md">
          Tap anywhere to skip
        </span>
      </div>
    </div>
  );
}
