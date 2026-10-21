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
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

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
          "radial-gradient(circle at 50% 50%, rgba(200, 215, 210, 0.12) 0%, rgba(15, 18, 17, 0.8) 45%, #000000 85%)",
        zIndex: 99999,
      }}
      className="fixed inset-0 w-screen h-[100dvh] overflow-hidden flex items-center justify-center cursor-pointer select-none"
    >
      {/* 
        High-Performance Hardware Accelerated Logo Reveal Video:
        1. Uses portrait 1080x1920 video for mobile and widescreen for desktop
        2. object-cover + object-center ensures the logo asset is vertically and horizontally centered with zero empty space
        3. Black/silver radial glow replaces any green palette
      */}
      <video
        ref={videoRef}
        key={isMobile ? "mobile-intro" : "desktop-intro"}
        src={
          isMobile
            ? "/vini-vici-vidi-mobile-logo-reveal.mp4"
            : "/vvv-logo-reveal.mp4"
        }
        playsInline
        autoPlay
        muted
        preload="auto"
        onEnded={handleExit}
        className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
      />

      {/* Lightweight GPU-accelerated vignette blend in monochrome/silver */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-radial from-transparent via-transparent to-black/80"
      />

      {/* Visible Tap to Skip affordance on mobile & desktop */}
      <div className="absolute z-50 bottom-7 sm:bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleExit();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/25 text-[0.62rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/90 font-medium backdrop-blur-md shadow-2xl transition-all cursor-pointer"
        >
          <span>Tap anywhere to skip</span>
        </button>
      </div>
    </div>
  );
}
