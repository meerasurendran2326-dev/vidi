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
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        window.innerWidth < 768 ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      );
    }
    return false;
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth cinematic exit transition
  const handleExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  }, [isExiting, onComplete]);

  // Track window resizing / device orientation changes
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Prevent background scrolling and ensure background remains pure during intro
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

  // Autoplay video immediately with zero lag - avoid currentTime=0 seek stall
  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.playbackRate = isMobile ? 1.5 : 2.0;

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

    return () => {
      video.removeEventListener("loadeddata", initiatePlayback);
      video.removeEventListener("canplay", initiatePlayback);
    };
  }, [isOpen, isMobile]);

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
        Full-viewport Seamless Luxury Intro Video:
        1. Radial gradient background matches the video's inner emerald ambient light.
        2. Subtle edge mask eliminates any sharp rectangular borders between the video frame and screen letterbox.
        3. Preloaded with zero seek stall for instant mobile playback.
      */}
      <video
        ref={videoRef}
        key={isMobile ? "mobile-reveal" : "desktop-reveal"}
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
        style={{
          backgroundColor: "transparent",
          maskImage:
            "radial-gradient(ellipse 98% 94% at 50% 50%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 98% 94% at 50% 50%, black 82%, transparent 100%)",
        }}
        className="w-full h-full object-contain sm:object-cover pointer-events-none"
      />

      {/* Discrete subtle skip hint in the corner */}
      <div className="absolute z-20 bottom-4 right-4 sm:bottom-6 sm:right-8 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-white/70 font-light drop-shadow-md">
          Tap anywhere to skip
        </span>
      </div>
    </div>
  );
}
