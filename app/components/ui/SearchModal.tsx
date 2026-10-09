"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { jewelleryProducts, type JewelleryProduct } from "@/app/data/jewellery-products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JewelleryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Focus input when opened & lock scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Instant local search + fallback backend search
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      // Fast immediate filter over atelier catalog
      const filtered = jewelleryProducts.filter((product) => {
        const matchesQuery =
          product.name.toLowerCase().includes(trimmed) ||
          product.category.toLowerCase().includes(trimmed) ||
          (product.subtitle && product.subtitle.toLowerCase().includes(trimmed)) ||
          (product.description && product.description.toLowerCase().includes(trimmed));

        const matchesCategory =
          activeCategory === "all" || product.category === activeCategory;

        return matchesQuery && matchesCategory;
      });

      setResults(filtered);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, activeCategory]);

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Atelier Collections"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-400/30 bg-[#061812]/95 shadow-2xl shadow-emerald-950/60 backdrop-blur-2xl">
        {/* Subtle radial emerald background illumination */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#1fe0bb]/10 blur-3xl pointer-events-none"
        />

        {/* Search Header Bar */}
        <form
          onSubmit={handleFullSearch}
          className="relative flex items-center border-b border-emerald-800/40 px-4 py-3 sm:px-6 sm:py-4"
        >
          <Search className="h-5 w-5 text-[#1fe0bb] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rings, pendants, bracelets, studs…"
            className="w-full bg-transparent px-3 text-sm sm:text-base font-medium text-white placeholder-emerald-100/40 focus:outline-none"
          />
          {loading && (
            <Loader2 className="h-4 w-4 text-[#1fe0bb] animate-spin shrink-0 mr-2" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-white/50 hover:text-white transition-colors mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-all ml-1"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {/* Quick Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6 border-b border-emerald-900/30 scrollbar-none text-[0.65rem] uppercase tracking-wider font-semibold">
          {[
            { id: "all", label: "All" },
            { id: "rings", label: "Rings" },
            { id: "bracelet", label: "Bracelets" },
            { id: "pendent-set", label: "Pendants" },
            { id: "stud", label: "Studs" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full transition-all shrink-0 ${
                activeCategory === cat.id
                  ? "bg-[#1fe0bb] text-[#03251c] font-bold"
                  : "bg-white/5 text-emerald-100/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 overscroll-contain">
          {query.trim() === "" ? (
            <div className="py-8 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-[#1fe0bb]/60 mb-2" />
              <p className="text-xs sm:text-sm font-medium text-emerald-100/70">
                Type a name, gem, or category to explore the atelier.
              </p>
              <p className="text-[0.65rem] text-emerald-100/40 uppercase tracking-widest mt-1">
                Certified 925 Sterling Silver Haute Joaillerie
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-white">No creations found</p>
              <p className="mt-1 text-xs text-emerald-100/50">
                No atelier pieces matched “{query}”. Try searching for “signet”, “emerald”, “cuff”, or “ring”.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#1fe0bb] mb-3">
                {results.length} {results.length === 1 ? "Creation" : "Creations"} Found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product.slug)}
                    className="flex items-center gap-3 rounded-2xl border border-emerald-900/40 bg-black/30 p-2.5 text-left transition-all hover:border-[#1fe0bb]/50 hover:bg-[#0B4A3B]/40 group"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-emerald-950/60">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="60px"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-200">
                        {product.name}
                      </p>
                      <p className="text-[0.62rem] text-emerald-100/60 truncate mt-0.5">
                        {product.subtitle}
                      </p>
                      <p className="text-xs font-bold text-[#1fe0bb] mt-1">
                        {product.price}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-[#1fe0bb] group-hover:translate-x-0.5 transition-all shrink-0 mr-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {query.trim() && results.length > 0 && (
          <div className="border-t border-emerald-900/40 px-4 py-3 sm:px-6 bg-[#04120D] flex items-center justify-between">
            <span className="text-[0.62rem] text-emerald-100/50 uppercase tracking-widest">
              Press Enter for all results
            </span>
            <button
              type="button"
              onClick={handleFullSearch}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1fe0bb] hover:underline"
            >
              <span>View Full Results</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
