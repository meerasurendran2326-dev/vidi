"use client";

import { useEffect, useState, useRef } from "react";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import dynamic from "next/dynamic";

import VideoEntryIntro from "@/components/ui/VideoEntryIntro";
import HeroMotionVisual from "@/components/ui/HeroMotionVisual";
import MotionMarquee from "@/components/ui/MotionMarquee";
import AmbientMotionLight from "@/components/ui/AmbientMotionLight";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import ShaderBackground from "@/components/ui/shader-background";

import CarouselStacked from "@/components/ui/carousel-07";
import { setupLenis } from "@/app/animations/scroll/lenis";
import { gsap } from "gsap";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showEntryVideo, setShowEntryVideo] = useState(true);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const lenis = setupLenis();

    // Smooth inertia scroll handler linked directly to Lenis RAF
    lenis.on(
      "scroll",
      ({ scroll, limit }: { scroll: number; limit: number }) => {
        const scrollY = scroll;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        // 1. Update Scroll Progress bar
        if (limit > 0) {
          setScrollProgress(
            Math.min(100, Math.max(0, (scrollY / limit) * 100)),
          );
        }

        // 2. Multi-depth Parallax on Hero elements (calibrated for mobile screens)
        const isMobile = windowWidth < 640;
        const pFactor = isMobile ? 0.35 : 1;

        const vini = document.querySelector(".brand-group-vini");
        const vici = document.querySelector(".brand-group-vici");
        const vidi = document.querySelector(".brand-group-vidi");
        const heroVisual = document.querySelector(
          ".hero-motion-visual-container",
        );
        const heroCta = document.querySelector(".hero-cta-container");

        if (vini) {
          gsap.to(vini, {
            y: scrollY * 0.28 * pFactor,
            x: -scrollY * 0.08 * pFactor,
            opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.65)),
            duration: 0.15,
            ease: "none",
            overwrite: "auto",
          });
        }

        if (vici) {
          gsap.to(vici, {
            scale: Math.max(0.82, 1 - (scrollY / windowHeight) * 0.2 * pFactor),
            y: scrollY * 0.12 * pFactor,
            opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.55)),
            duration: 0.15,
            ease: "none",
            overwrite: "auto",
          });
        }

        if (vidi) {
          gsap.to(vidi, {
            y: -scrollY * 0.18 * pFactor,
            x: scrollY * 0.08 * pFactor,
            opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.65)),
            duration: 0.15,
            ease: "none",
            overwrite: "auto",
          });
        }

        if (heroVisual) {
          gsap.to(heroVisual, {
            y: scrollY * 0.16 * pFactor,
            scale: Math.max(0.88, 1 - (scrollY / windowHeight) * 0.14 * pFactor),
            duration: 0.18,
            ease: "none",
            overwrite: "auto",
          });
        }

        if (heroCta) {
          gsap.to(heroCta, {
            opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.38)),
            y: scrollY * 0.22 * pFactor,
            duration: 0.15,
            overwrite: "auto",
          });
        }

        // 3. Carousel Showcase header elevation on approach
        const carouselHeader = document.querySelector(".carousel-header");
        if (carouselHeader) {
          const rect = carouselHeader.getBoundingClientRect();
          if (rect.top < windowHeight * 0.9) {
            gsap.to(carouselHeader, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        }
      },
    );

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="luxury-page bg-gradient-to-b from-[#01140E] via-[#042E22] to-[#01120D] text-[#F8F7F4] relative">
      <VideoEntryIntro
        isOpen={showEntryVideo}
        onComplete={() => setShowEntryVideo(false)}
      />

      {/* Interactive Cursor Ambient Motion Glow */}
      <AmbientMotionLight />

      {/* Sleek Luminous Scroll Progress Indicator */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
      >
        <div
          className="h-full bg-gradient-to-r from-[#0B4A3B] via-[#1fe0bb] to-[#E6F2EA] shadow-[0_0_12px_#1fe0bb] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="showroom-shell is-entered">
        <SiteHeader />

        {/* Hero Section */}
        <section
          ref={heroSectionRef}
          className="relative isolate flex items-start justify-center min-h-[85dvh] sm:min-h-[96vh] px-2 sm:px-[3vw] pt-2 overflow-hidden bg-[#0B6B4D]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <ShaderBackground />
          </div>

          <div className="relative z-10 w-full max-w-[1700px] min-h-[80vh] sm:min-h-[90vh] flex items-start justify-center pt-4 pointer-events-none">


            {/* Pure VINI VICI VIDI Branding - 925 Sterling Silver Gradient Finish with Motion Shimmer */}
            <div className="absolute inset-0 z-2 w-full h-full uppercase pointer-events-none font-display">
              {/* VINI (Top Left) */}
              <div className="brand-group-vini animate-float-slow absolute top-[8%] xs:top-[9%] sm:top-[4%] left-[4%] flex items-center z-1 text-[clamp(2.5rem,10.5vw,20rem)] font-black leading-[0.88] tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] select-none">
                <span className="animate-silver-shimmer">VINI</span>
              </div>

              {/* VICI (Centerpiece with Radiant Pulsing Aura) */}
              <div className="brand-group-vici absolute top-[48%] sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-1 text-[clamp(4rem,16.5vw,36rem)] font-black leading-[0.88] tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#E6F2EA] to-[#8FA69B] bg-clip-text text-transparent drop-shadow-[0_15px_38px_rgba(0,0,0,0.75)] select-none">
                <span className="animate-silver-shimmer">VICI</span>
                <div className="absolute w-[130%] sm:w-[160%] h-[130%] sm:h-[160%] rounded-full bg-radial from-[#2FE4B6]/25 via-[#0B4A3B]/15 to-transparent blur-[45px] sm:blur-[85px] pointer-events-none -z-1 animate-pulse-glow" />
              </div>

              {/* VIDI (Bottom Right) */}
              <div className="brand-group-vidi animate-float-reverse absolute bottom-[18%] xs:bottom-[16%] sm:bottom-[6%] right-[4%] flex items-center z-1 text-[clamp(2.5rem,10.5vw,20rem)] font-black leading-[0.88] tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] select-none">
                <span className="animate-silver-shimmer">VIDI</span>
              </div>
            </div>

            {/* High Jewellery Center Motion Visual */}
            <div className="hero-motion-visual-container absolute top-[49%] sm:top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[850px] h-[220px] xs:h-[280px] sm:h-[480px] lg:h-[580px] flex items-center justify-center z-20 pointer-events-none will-change-transform">
              <HeroMotionVisual />
            </div>

            {/* Deep Emerald Dual CTA Button Group in Hero */}
            <div className="hero-cta-container absolute bottom-3 xs:bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 sm:gap-4 flex-wrap justify-center w-full max-w-[94vw] px-2 sm:px-4">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-shop-menu"));
                }}
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 xs:px-6 xs:py-3 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-r from-[#1fe0bb] via-[#2fe4b6] to-[#E6F2EA] text-[#011811] font-bold text-[0.66rem] xs:text-[0.7rem] sm:text-xs tracking-[0.16em] sm:tracking-[0.22em] uppercase shadow-2xl shadow-[#1fe0bb]/35 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/40 max-w-[90vw] whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#011811] shrink-0" />
                <span>Start Shopping</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#011811] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <a
                href="#showcase"
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 xs:px-6 xs:py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#0B4A3B] text-white font-semibold text-[0.66rem] xs:text-[0.7rem] sm:text-xs tracking-[0.16em] sm:tracking-[0.22em] uppercase shadow-2xl shadow-[#0B4A3B]/45 hover:bg-[#1F7A5C] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#E6F2EA]/30 max-w-[90vw] whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1fe0bb] animate-pulse shrink-0" />
                <span>Explore Showcase</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E6F2EA] group-hover:translate-x-1 transition-transform shrink-0" />
              </a>
            </div>
          </div>
        </section>

        {/* Continuous Kinetic Motion Marquee Animation */}
        <MotionMarquee speed={28} />

        {/* 3D Stacked Card Carousel Section */}
        <section
          id="showcase"
          className="relative isolate w-full overflow-hidden bg-gradient-to-b from-[#021F17]/90 via-[#053729]/80 to-[#021E16]/90 border-t border-b border-[#1fe0bb]/20"
        >
          <div id="collection" className="sr-only" />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <FlickeringGrid
              color="#f7f3ee"
              squareSize={4}
              gridGap={9}
              maxOpacity={0.22}
              flickerChance={0.16}
              className="h-full w-full"
            />
          </div>
          <div className="relative z-10">
            <CarouselStacked />
          </div>
        </section>



        {/* 4-Column Footer in Green-White Combo */}
        <FooterColumn />
      </div>
    </main>
  );
}
