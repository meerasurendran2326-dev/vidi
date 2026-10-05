"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { ShaderBackground } from "@/components/ui/adisyon-shader";
import { useWishlist } from "@/app/context/WishlistContext";
import type { JewelleryProduct } from "@/app/data/jewellery-products";

interface JewelleryPageLayoutProps {
  category: string;
  tagline: string;
  description: string;
  products: JewelleryProduct[];
}

export function JewelleryPageLayout({
  category,
  tagline,
  description,
  products,
}: JewelleryPageLayoutProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#020704] text-slate-100 overflow-x-hidden">
      {/* ── WebGL Shader Waves Background: Black -> Dark Green -> White ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <ShaderBackground className="w-full h-full opacity-80" />
        {/* Soft gradient wash over shader to ensure rich contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <SiteHeader />

        {/* ── Hero Banner ── */}
        <section className="relative pt-16 pb-14 px-6 sm:px-10 text-center overflow-hidden">
          {/* Decorative emerald ambient glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-white/5 blur-2xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <p className="text-xs tracking-[0.28em] uppercase font-semibold text-emerald-400 mb-3 drop-shadow-sm">
              Vini Vici Vidi · Silver Atelier
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "var(--font-editorial), serif" }}
            >
              {category}
            </h1>
            <p
              className="mt-3 text-lg sm:text-xl text-emerald-200/90 italic drop-shadow-sm"
              style={{ fontFamily: "var(--font-editorial), serif" }}
            >
              {tagline}
            </p>
            <p className="mt-4 max-w-xl mx-auto text-sm text-emerald-100/80 leading-relaxed drop-shadow-sm">
              {description}
            </p>

            {/* Decorative rule */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-emerald-400/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-emerald-400/80" />
            </div>
          </motion.div>
        </section>

        {/* ── Product Grid ── */}
        <section className="flex-1 px-5 sm:px-8 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const isLiked = isInWishlist(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  onMouseEnter={() => setHovered(product.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: "rgba(10, 24, 18, 0.72)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(52, 211, 153, 0.22)",
                    boxShadow:
                      hovered === product.id
                        ? "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1.5px rgba(52, 211, 153, 0.45)"
                        : "0 8px 24px rgba(0, 0, 0, 0.45)",
                    transition:
                      "box-shadow 0.35s ease, border-color 0.35s ease",
                  }}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    aria-label={`View ${product.name} details`}
                    className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
                  />

                  {/* Image wrapper */}
                  <div className="relative z-10 aspect-square overflow-hidden bg-gradient-to-br from-emerald-950/70 via-emerald-900/40 to-black pointer-events-none">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      animate={{ scale: hovered === product.id ? 1.06 : 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />

                    {/* Overlay gradient on hover */}
                    <AnimatePresence>
                      {hovered === product.id && (
                        <motion.div
                          key="overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent"
                        />
                      )}
                    </AnimatePresence>

                    {/* Badges */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[0.58rem] tracking-[0.12em] uppercase font-semibold px-2.5 py-1 rounded-full shadow-md border border-emerald-400/30">
                        {product.badge}
                      </span>
                    )}
                    {product.isNew && (
                      <span className="absolute top-3 right-12 bg-white/90 text-emerald-950 text-[0.58rem] tracking-[0.12em] uppercase font-bold px-2.5 py-1 rounded-full shadow-sm">
                        New
                      </span>
                    )}

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="pointer-events-auto absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center shadow-md border border-emerald-500/30 transition-transform hover:scale-110 active:scale-95"
                      aria-label="Add to wishlist"
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${
                          isLiked
                            ? "fill-rose-500 stroke-rose-500"
                            : "fill-none stroke-white hover:stroke-rose-400"
                        }`}
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="relative z-10 pointer-events-none p-4 flex flex-col gap-1.5">
                    <p className="text-[0.62rem] tracking-[0.18em] uppercase text-emerald-400 font-semibold">
                      {product.subtitle}
                    </p>
                    <h3
                      className="text-sm font-semibold text-white leading-snug"
                      style={{ fontFamily: "var(--font-editorial), serif" }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-base font-bold text-emerald-300">
                        {product.price}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`pointer-events-auto text-[0.62rem] tracking-wider uppercase font-semibold px-3.5 py-1.5 rounded-full transition-colors shadow-md border ${
                          isLiked
                            ? "bg-emerald-500 text-black border-emerald-300 font-bold"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/30"
                        }`}
                      >
                        {isLiked ? "Saved ♥" : "Add to Favorites"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Atelier Luxury Footer (matching Header pattern and emerald branding) ── */}
        <FooterColumn />
      </div>
    </div>
  );
}
