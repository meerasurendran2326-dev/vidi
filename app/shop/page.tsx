"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PageLayout } from "@/app/components/ui/PageLayout";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  slug?: string;
  description?: string;
  inventory?: { quantity: number }[];
}

const CATEGORIES = ["All", "Rings", "Bracelets", "Pendants", "Studs", "Necklaces"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A–Z", value: "name_asc" },
];

function formatPrice(p: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);
}

function getCategorySlug(cat: string) {
  const map: Record<string, string> = {
    Rings: "rings",
    Bracelets: "bracelet",
    Pendants: "pendent-set",
    Studs: "stud",
    Necklaces: "rings",
  };
  return map[cat] ?? "rings";
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [inputMin, setInputMin] = useState("0");
  const [inputMax, setInputMax] = useState("500000");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.products ?? data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products
    .filter((p) => p.price >= minPrice && p.price <= maxPrice)
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <PageLayout>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0B4A3B] via-[#1a6b55] to-[#0B4A3B] py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="shop-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <polygon points="30,2 58,30 30,58 2,30" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shop-grid)" />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <p className="text-[#C6A96C] tracking-[0.35em] text-xs uppercase mb-3 font-light">The Collection</p>
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop All Jewellery
          </h1>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Timeless pieces crafted with precision and elegance
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B4A3B]/40" />
            <input
              type="text"
              placeholder="Search jewellery…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#0B4A3B]/15 rounded-xl text-sm text-[#0B4A3B] placeholder:text-[#0B4A3B]/40 focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20"
            />
          </div>
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-[#0B4A3B]/15 rounded-xl text-sm text-[#0B4A3B] focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B4A3B]/50 pointer-events-none" />
          </div>
          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen((p) => !p)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#0B4A3B]/15 rounded-xl text-sm text-[#0B4A3B] hover:bg-[#0B4A3B] hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-[#0B4A3B]/10 rounded-2xl p-5 mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#0B4A3B]/50 mb-3 font-medium">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          category === c
                            ? "bg-[#0B4A3B] text-white border-[#0B4A3B]"
                            : "bg-transparent text-[#0B4A3B] border-[#0B4A3B]/20 hover:border-[#0B4A3B]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#0B4A3B]/50 mb-3 font-medium">Price Range</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={inputMin}
                      onChange={(e) => setInputMin(e.target.value)}
                      onBlur={() => setMinPrice(Number(inputMin))}
                      className="w-28 px-3 py-1.5 border border-[#0B4A3B]/15 rounded-lg text-sm text-[#0B4A3B] focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20"
                      placeholder="Min"
                    />
                    <span className="text-[#0B4A3B]/40">–</span>
                    <input
                      type="number"
                      value={inputMax}
                      onChange={(e) => setInputMax(e.target.value)}
                      onBlur={() => setMaxPrice(Number(inputMax))}
                      className="w-28 px-3 py-1.5 border border-[#0B4A3B]/15 rounded-lg text-sm text-[#0B4A3B] focus:outline-none focus:ring-2 focus:ring-[#0B4A3B]/20"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category pills (always visible) */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === c
                  ? "bg-[#0B4A3B] text-white border-[#0B4A3B] shadow"
                  : "bg-white text-[#0B4A3B] border-[#0B4A3B]/20 hover:border-[#0B4A3B]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-[#0B4A3B]/50 mb-6">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#0B4A3B]/40 text-lg mb-2">No pieces found</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="text-sm text-[#C6A96C] underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/product/${product.slug ?? product.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#0B4A3B]/5">
                      <div className="aspect-square overflow-hidden bg-[#F0EDE8] relative">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[#0B4A3B]/20 text-4xl">◇</span>
                          </div>
                        )}
                        {product.inventory && product.inventory.reduce((s, i) => s + i.quantity, 0) === 0 && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="text-xs text-[#0B4A3B]/60 uppercase tracking-widest">Sold Out</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <p className="text-[9px] uppercase tracking-widest text-[#C6A96C] mb-1 font-medium">{product.category}</p>
                        <h3 className="text-sm font-medium text-[#0B4A3B] leading-tight line-clamp-2 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {product.name}
                        </h3>
                        <p className="text-[#0B4A3B] font-semibold text-sm">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
