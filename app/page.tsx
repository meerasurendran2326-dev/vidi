"use client";

import { useEffect, useState, useRef } from "react";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import dynamic from "next/dynamic";

import VideoEntryIntro from "@/components/ui/VideoEntryIntro";
import HeroMotionVisual from "@/components/ui/HeroMotionVisual";
import MotionMarquee from "@/components/ui/MotionMarquee";
import AmbientMotionLight from "@/components/ui/AmbientMotionLight";

import CarouselStacked from "@/components/ui/carousel-07";
const InfiniteGallery = dynamic(() => import("@/components/ui/3d-gallery-photography"), { ssr: false });
import KineticGrid from "@/components/ui/kinetic-grid";
import { setupLenis } from "@/app/animations/scroll/lenis";
import { gsap } from "gsap";
import { ArrowRight, Sparkles, Film, Play } from "lucide-react";

const galleryImages = [
  { src: "/images/custom/img1.jpeg", alt: "Vici Obsidian Signet Ring" },
  { src: "/images/custom/img2.jpeg", alt: "Celestial Emerald Pendant" },
  { src: "/images/custom/img3.jpeg", alt: "Aura Silver Choker" },
  { src: "/images/custom/img4.jpeg", alt: "Lumina Eternity Band" },
  { src: "/images/custom/img5.jpeg", alt: "Verdant Royal Solitaire" },
  { src: "/images/custom/img6.jpeg", alt: "Sovereign Sculpted Cuff" },
  { src: "/images/custom/img7.jpeg", alt: "Imperial Drop Earrings" },
  { src: "/images/custom/img8.jpeg", alt: "Midnight Filigree Stud" },
  { src: "/images/custom/img9.jpeg", alt: "Dew Droplet Aquamarine" },
  { src: "/images/custom/img10.jpeg", alt: "Lumina Tennis Bracelet" },
  { src: "/images/custom/img11.jpeg", alt: "Helio Noir Ring" },
  { src: "/images/custom/img12.jpeg", alt: "Stella Link Choker" },
  { src: "/images/custom/img13.jpeg", alt: "Astral Emerald Pendant" },
  { src: "/images/custom/img14.jpeg", alt: "Solstice Geometric Drops" },
  { src: "/images/custom/img15.jpeg", alt: "Bespoke Sculpted Band" },
  { src: "/images/custom/img16.jpeg", alt: "Vici Signature Signet" },
  { src: "/images/custom/img17.jpeg", alt: "Chrono Geometric Signet" },
  { src: "/images/custom/img18.jpeg", alt: "Solstice Radiant Studs" },
  { src: "/images/custom/img19.jpeg", alt: "Nova Eternity Band" },
  { src: "/images/custom/img20.jpeg", alt: "Zenith Statement Pendant" },
];

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showEntryVideo, setShowEntryVideo] = useState(true);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const lenis = setupLenis();

    // Smooth inertia scroll handler linked directly to Lenis RAF
    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      const scrollY = scroll;
      const windowHeight = window.innerHeight;

      // 1. Update Scroll Progress bar
      if (limit > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / limit) * 100)));
      }

      // 2. Multi-depth Parallax on Hero elements
      const vini = document.querySelector(".brand-group-vini");
      const vici = document.querySelector(".brand-group-vici");
      const vidi = document.querySelector(".brand-group-vidi");
      const heroVisual = document.querySelector(".hero-motion-visual-container");
      const heroCta = document.querySelector(".hero-cta-container");

      if (vini) {
        gsap.to(vini, {
          y: scrollY * 0.28,
          x: -scrollY * 0.08,
          opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.65)),
          duration: 0.15,
          ease: "none",
          overwrite: "auto",
        });
      }

      if (vici) {
        gsap.to(vici, {
          scale: Math.max(0.82, 1 - (scrollY / windowHeight) * 0.2),
          y: scrollY * 0.12,
          opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.55)),
          duration: 0.15,
          ease: "none",
          overwrite: "auto",
        });
      }

      if (vidi) {
        gsap.to(vidi, {
          y: -scrollY * 0.18,
          x: scrollY * 0.08,
          opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.65)),
          duration: 0.15,
          ease: "none",
          overwrite: "auto",
        });
      }

      if (heroVisual) {
        gsap.to(heroVisual, {
          y: scrollY * 0.16,
          scale: Math.max(0.88, 1 - (scrollY / windowHeight) * 0.14),
          duration: 0.18,
          ease: "none",
          overwrite: "auto",
        });
      }

      if (heroCta) {
        gsap.to(heroCta, {
          opacity: Math.max(0, 1 - scrollY / (windowHeight * 0.38)),
          y: scrollY * 0.22,
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
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="luxury-page bg-gradient-to-b from-[#01140E] via-[#042E22] to-[#01120D] text-[#F8F7F4] relative">
      {/* MP4 Cinematic Video Entry Reveal Overlay */}
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
          className="relative flex items-start justify-center min-h-[96vh] px-[3vw] pt-2 overflow-hidden bg-gradient-to-b from-[#011811]/90 via-[#02281D]/75 to-transparent"
        >
          {/* Interactive Kinetic Grid Background with Classy Shiny Green Shade & Metallic Silver Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 overflow-hidden"
          >
            <KineticGrid
              globalColor="emerald-silver"
              className="w-full h-full min-h-[96vh]"
              canvasClassName="w-full h-full"
              interactiveTargetRef={heroSectionRef}
            />

            {/* Glowing Pulsating Emerald & Silver Ambient Flares */}
            <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#1fe0bb]/20 via-[#0B4A3B]/20 to-transparent blur-[110px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#021811] via-[#0B4A3B]/35 to-[#2fe4b6]/15 blur-[120px] pointer-events-none" />

            {/* High-Definition Royal Diamond Lattice Filigree Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-25 pointer-events-none mix-blend-screen"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="hero-jewelry-pattern"
                  width="72"
                  height="72"
                  patternUnits="userSpaceOnUse"
                >
                  <polygon
                    points="36,2 70,36 36,70 2,36"
                    fill="none"
                    stroke="#A7F3D0"
                    strokeWidth="1.1"
                    opacity="0.45"
                  />
                  <polygon
                    points="36,14 58,36 36,58 14,36"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    opacity="0.35"
                  />
                  <line x1="0" y1="0" x2="72" y2="72" stroke="#34D399" strokeWidth="0.5" opacity="0.25" />
                  <line x1="72" y1="0" x2="0" y2="72" stroke="#34D399" strokeWidth="0.5" opacity="0.25" />
                  <line x1="36" y1="24" x2="36" y2="48" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.5" />
                  <line x1="24" y1="36" x2="48" y2="36" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.5" />
                  <circle cx="36" cy="36" r="2.2" fill="#FFFFFF" opacity="0.75" />
                  <circle cx="0" cy="0" r="1.5" fill="#34D399" opacity="0.5" />
                  <circle cx="72" cy="0" r="1.5" fill="#34D399" opacity="0.5" />
                  <circle cx="0" cy="72" r="1.5" fill="#34D399" opacity="0.5" />
                  <circle cx="72" cy="72" r="1.5" fill="#34D399" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-jewelry-pattern)" />
            </svg>

            {/* Soft Radial Vignette for Perfect Luxury Contrast */}
            <div className="absolute inset-0 bg-radial from-transparent via-[#021811]/30 to-[#010c08]/75 pointer-events-none" />
            {/* Seamless Bottom Fade into Showcase */}
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#021811] via-[#021811]/60 to-transparent pointer-events-none" />
          </div>

          <div className="relative w-full max-w-[1700px] min-h-[90vh] flex items-start justify-center pt-4 pointer-events-none">
            {/* Floating Luxury High Jewellery Badge */}
            <div className="absolute top-[12%] sm:top-[16%] left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 px-6 py-2 rounded-full bg-[#01140E]/85 border border-[#1fe0bb]/40 backdrop-blur-md shadow-[0_0_30px_rgba(31,224,187,0.25)] animate-float-slow pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#1fe0bb] animate-spin" style={{ animationDuration: "7s" }} />
              <span className="text-[0.6rem] sm:text-[0.66rem] tracking-[0.32em] text-[#E6F2EA] uppercase font-bold">
                Pure 925 Silver Atelier • High Jewellery Motion
              </span>
            </div>

            {/* Pure VINI VICI VIDI Branding - 925 Sterling Silver Gradient Finish with Motion Shimmer */}
            <div className="absolute inset-0 z-2 w-full h-full uppercase pointer-events-none font-display">
              {/* VINI (Top Left) */}
              <div className="brand-group-vini animate-float-slow absolute top-[4%] left-[4%] flex items-center z-1 text-[clamp(6rem,14vw,20rem)] font-black leading-[0.88] tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] select-none">
                <span className="animate-silver-shimmer">VINI</span>
              </div>

              {/* VICI (Centerpiece with Radiant Pulsing Aura) */}
              <div className="brand-group-vici absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-1 text-[clamp(10rem,24vw,36rem)] font-black leading-[0.88] tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#E6F2EA] to-[#8FA69B] bg-clip-text text-transparent drop-shadow-[0_15px_38px_rgba(0,0,0,0.75)] select-none">
                <span className="animate-silver-shimmer">VICI</span>
                <div className="absolute w-[160%] h-[160%] rounded-full bg-radial from-[#2FE4B6]/25 via-[#0B4A3B]/15 to-transparent blur-[85px] pointer-events-none -z-1 animate-pulse-glow" />
              </div>

              {/* VIDI (Bottom Right) */}
              <div className="brand-group-vidi animate-float-reverse absolute bottom-[6%] right-[4%] flex items-center z-1 text-[clamp(6rem,14vw,20rem)] font-black leading-[0.88] tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] select-none">
                <span className="animate-silver-shimmer">VIDI</span>
              </div>
            </div>

            {/* High Jewellery Center Motion Visual (Replaces the 3D ring with dynamic 3D kinetic orbital motion) */}
            <div className="hero-motion-visual-container absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[850px] h-[580px] flex items-center justify-center z-20 pointer-events-none will-change-transform">
              <HeroMotionVisual />
            </div>

            {/* Deep Emerald Dual CTA Button Group in Hero */}
            <div className="hero-cta-container absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-4 flex-wrap justify-center">
              <a
                href="#showcase"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0B4A3B] text-white font-semibold text-xs tracking-[0.22em] uppercase shadow-2xl shadow-[#0B4A3B]/45 hover:bg-[#1F7A5C] hover:scale-105 transition-all duration-300 border border-[#E6F2EA]/30"
              >
                <Sparkles className="w-4 h-4 text-[#1fe0bb] animate-pulse" />
                <span>Explore Showcase</span>
                <ArrowRight className="w-4 h-4 text-[#E6F2EA] group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={() => setShowEntryVideo(true)}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#E6F2EA] hover:text-white font-semibold text-xs tracking-[0.2em] uppercase backdrop-blur-md transition-all duration-300 border border-[#1fe0bb]/35 shadow-lg shadow-black/20"
              >
                <Film className="w-4 h-4 text-[#1fe0bb] group-hover:scale-110 transition-transform" />
                <span>Watch Reveal</span>
              </button>
            </div>
          </div>
        </section>

        {/* Continuous Kinetic Motion Marquee Animation */}
        <MotionMarquee speed={28} />

        {/* 3D Stacked Card Carousel Section */}
        <section id="showcase" className="relative w-full overflow-hidden bg-gradient-to-b from-[#021F17]/90 via-[#053729]/80 to-[#021E16]/90 border-t border-b border-[#1fe0bb]/20">
          <CarouselStacked />
        </section>

        {/* 3D Infinite Photography Gallery */}
        <section
          id="collection"
          className="relative w-full bg-gradient-to-b from-[#021E16]/90 via-[#01160F] to-[#01120D] border-b border-[#1fe0bb]/20 overflow-hidden"
        >
          {/* Ambient emerald glow */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1100px] h-[500px] bg-gradient-to-r from-[#00ffc4]/15 via-[#00c9a7]/25 to-[#008e76]/15 blur-[110px] rounded-full pointer-events-none z-0"
          />

          {/* Full-screen 3D Gallery Canvas */}
          <InfiniteGallery
            images={galleryImages}
            speed={1.2}
            visibleCount={12}
            className="h-screen w-full"
          />

          {/* Overlay Text */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 z-20 mix-blend-exclusion">
            <span className="text-[0.65rem] tracking-[0.3em] font-bold text-[#1fe0bb] uppercase mb-3 drop-shadow-[0_0_12px_rgba(31,224,187,0.4)]">
              Atelier Creations
            </span>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Collection
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-3 italic" style={{ fontFamily: "var(--font-editorial), serif" }}>
              Scroll or drag to explore the atelier in infinite 3D depth
            </p>
          </div>

          {/* Navigation hint */}
          <div className="absolute bottom-8 left-0 right-0 text-center z-20 pointer-events-none">
            <p className="text-[0.6rem] tracking-[0.15em] uppercase text-white/40 font-medium">
              Use mouse wheel, arrow keys, or touch to navigate
            </p>
          </div>
        </section>

        {/* 4-Column Footer in Green-White Combo */}
        <FooterColumn />
      </div>

      {/* Floating Quick Replay Trigger (Bottom Left) */}
      <button
        type="button"
        onClick={() => setShowEntryVideo(true)}
        aria-label="Replay intro film"
        className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#01140E]/90 hover:bg-[#0B4A3B] border border-[#1fe0bb]/40 text-[#E6F2EA] hover:text-white backdrop-blur-md shadow-xl shadow-black/40 text-[0.62rem] tracking-[0.2em] uppercase font-semibold transition-all hover:scale-105 group"
      >
        <Play className="w-3 h-3 text-[#1fe0bb] fill-[#1fe0bb] group-hover:scale-110 transition-transform" />
        <span>Replay Reveal</span>
      </button>
    </main>
  );
}
