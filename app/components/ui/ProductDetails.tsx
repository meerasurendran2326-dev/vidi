"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { addProductToCart } from "@/app/context/CartStore";
import { useWishlist } from "@/app/context/WishlistContext";
import { ShaderBackground } from "@/components/ui/adisyon-shader";
import type { JewelleryProduct } from "@/app/data/jewellery-products";

interface ProductDetailsProps {
  product: JewelleryProduct;
}

const AVAILABLE_RING_SIZES = ["10", "12", "14", "16", "18", "20"];

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const isRing = product.category === "rings";
  const [selectedRingSize, setSelectedRingSize] = useState(isRing ? "14" : "");

  // Accordion open states
  const [openSection, setOpenSection] = useState<string | null>("specs");

  const toggleSection = (name: string) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const images = product.images?.length ? product.images : [product.image];
  const saved = isInWishlist(product.id);
  const unavailable = product.stock !== undefined && product.stock <= 0;
  const description = product.description || product.subtitle;

  const availability =
    product.availability ??
    (product.stock === undefined
      ? "Contact the atelier to confirm"
      : product.stock > 0
        ? `${product.stock} available`
        : "Currently unavailable");

  const addToCart = () => {
    const options: Record<string, string> = isRing && selectedRingSize ? { "Ring Size": selectedRingSize } : {};
    if (addProductToCart(product, quantity, options)) {
      setCartMessage(
        `${quantity} ${quantity === 1 ? "item" : "items"}${isRing ? ` (Size ${selectedRingSize})` : ""} added to your bag.`,
      );
    }
  };

  const buyNow = () => {
    const options: Record<string, string> = isRing && selectedRingSize ? { "Ring Size": selectedRingSize } : {};
    if (addProductToCart(product, quantity, options)) {
      router.push("/checkout");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020704] text-slate-100">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderBackground className="h-full w-full opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-7xl flex-1 px-3.5 py-6 sm:px-8 sm:py-12 lg:px-12">
          <Link
            href={`/${product.category}`}
            className="mb-5 sm:mb-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to{" "}
            {product.category === "pendent-set"
              ? "Pendent Set"
              : product.category}
          </Link>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-14">
            <section aria-label="Product images" className="min-w-0">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-950/80 via-emerald-900/45 to-black shadow-2xl shadow-black/40">
                <Image
                  key={images[selectedImage]}
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                {product.badge && (
                  <span className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full border border-emerald-300/30 bg-emerald-700/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[0.55rem] sm:text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur">
                    {product.badge}
                  </span>
                )}
                {product.isNew && (
                  <span className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-white/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[0.55rem] sm:text-[0.62rem] font-bold uppercase tracking-[0.14em] text-emerald-950">
                    New
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:gap-3 scrollbar-none">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={selectedImage === index}
                      className={`relative aspect-square w-16 h-16 xs:w-20 xs:h-20 sm:w-auto sm:h-auto shrink-0 overflow-hidden rounded-lg border transition-colors ${
                        selectedImage === index
                          ? "border-emerald-300 ring-2 ring-emerald-300/30"
                          : "border-white/15 hover:border-white/45"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name}, view ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-emerald-300/20 bg-[#06130e]/80 p-4 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-8">
              <p className="text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                {product.category === "pendent-set"
                  ? "Pendent Set"
                  : product.category}
              </p>
              <h1
                className="mt-2 sm:mt-3 text-2xl xs:text-3xl sm:text-4xl font-semibold leading-tight text-white"
                style={{ fontFamily: "var(--font-editorial), serif" }}
              >
                {product.name}
              </h1>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-emerald-100/75">
                {description}
              </p>

              <p
                className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-emerald-200"
                aria-label={`Price ${product.price}`}
              >
                {product.price}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-emerald-100/85">
                <span
                  className={`h-2 w-2 rounded-full ${unavailable ? "bg-rose-400" : "bg-emerald-300"}`}
                  aria-hidden="true"
                />
                <span>Availability: {availability}</span>
              </div>

              {/* Ring Size Selection (Only for Rings) */}
              {isRing && (
                <div className="mt-6 border-t border-emerald-900/40 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                      Ring Size (Indian/Standard)
                    </span>
                    <Link
                      href="/size-guide"
                      target="_blank"
                      className="text-[0.65rem] uppercase tracking-wider text-[#1fe0bb] hover:underline"
                    >
                      Size Guide →
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_RING_SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedRingSize(sz)}
                        className={`h-9 w-10 sm:h-10 sm:w-11 rounded-xl text-xs font-semibold transition-all ${
                          selectedRingSize === sz
                            ? "bg-[#1fe0bb] text-[#03251c] font-bold shadow-md shadow-[#1fe0bb]/20 scale-105"
                            : "border border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-full border border-white/20 bg-black/25">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center text-white transition-colors hover:text-emerald-300 active:scale-95 disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className="min-w-10 text-center text-sm font-semibold"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        product.stock === undefined
                          ? value + 1
                          : Math.min(product.stock, value + 1),
                      )
                    }
                    disabled={
                      product.stock !== undefined && quantity >= product.stock
                    }
                    aria-label="Increase quantity"
                    className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center text-white transition-colors hover:text-emerald-300 active:scale-95 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Cart Buttons */}
              <div className="mt-6 sm:mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-[1fr_1fr_auto] sm:gap-3">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={unavailable}
                  className="col-span-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-700 px-3 xs:px-5 text-[0.68rem] xs:text-xs font-bold uppercase tracking-[0.12em] xs:tracking-[0.14em] text-white shadow-lg transition-colors hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                  <span>Add to Bag</span>
                </button>
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={unavailable}
                  className="col-span-1 min-h-12 rounded-full bg-[#1fe0bb] px-3 xs:px-5 text-[0.68rem] xs:text-xs font-bold uppercase tracking-[0.12em] xs:tracking-[0.14em] text-[#03251c] shadow-lg transition-colors hover:bg-emerald-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={
                    saved ? "Remove from favorites" : "Add to favorites"
                  }
                  aria-pressed={saved}
                  className="col-span-2 sm:col-span-1 min-h-11 sm:h-12 sm:w-12 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-rose-300/60 hover:text-rose-300 active:scale-95 sm:justify-self-end"
                >
                  <Heart
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${saved ? "fill-rose-400 text-rose-400" : ""}`}
                  />
                  <span className="sm:hidden text-xs uppercase tracking-wider font-semibold">
                    {saved ? "Saved in Favorites" : "Save to Favorites"}
                  </span>
                </button>
              </div>

              <p
                role="status"
                aria-live="polite"
                className="mt-4 min-h-5 text-sm text-emerald-200/90"
              >
                {cartMessage}
              </p>

              {/* Information Accordions */}
              <div className="mt-8 border-t border-emerald-900/50 divide-y divide-emerald-900/40 text-sm">
                {/* Specifications */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection("specs")}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/90 hover:text-[#1fe0bb] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#1fe0bb]" />
                      Specifications & Details
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSection === "specs" ? "rotate-180 text-[#1fe0bb]" : "text-white/40"
                      }`}
                    />
                  </button>
                  {openSection === "specs" && (
                    <div className="pt-3 text-xs text-emerald-100/70 space-y-2">
                      <div className="grid grid-cols-2 gap-2 border-b border-emerald-900/30 pb-2">
                        <span className="text-white/50">Material</span>
                        <span className="text-white font-medium">Pure 925 Sterling Silver</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-emerald-900/30 pb-2">
                        <span className="text-white/50">Purity</span>
                        <span className="text-white font-medium">92.5% Certified Silver</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-emerald-900/30 pb-2">
                        <span className="text-white/50">Finish</span>
                        <span className="text-white font-medium">High Luster Anti-Tarnish Rhodium</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-emerald-900/30 pb-2">
                        <span className="text-white/50">Atelier SKU</span>
                        <span className="font-mono text-white/80">VVV-{product.id.toUpperCase()}</span>
                      </div>
                      {product.subtitle && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-white/50">Stone / Details</span>
                          <span className="text-white font-medium">{product.subtitle}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Delivery & Insured Shipping */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection("shipping")}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/90 hover:text-[#1fe0bb] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#1fe0bb]" />
                      Delivery & Insured Shipping
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSection === "shipping" ? "rotate-180 text-[#1fe0bb]" : "text-white/40"
                      }`}
                    />
                  </button>
                  {openSection === "shipping" && (
                    <div className="pt-3 text-xs text-emerald-100/70 space-y-2 leading-relaxed">
                      <p>
                        Complimentary insured express courier shipping across India within 3–5 business days.
                        Every piece is delivered in tamper-proof luxury presentation packaging.
                      </p>
                      <Link
                        href="/shipping-policy"
                        className="inline-block text-[#1fe0bb] text-[0.68rem] font-semibold tracking-wider hover:underline pt-1"
                      >
                        Read Full Shipping Policy →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Returns & Exchange */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection("returns")}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/90 hover:text-[#1fe0bb] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 text-[#1fe0bb]" />
                      Returns & Exchange
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSection === "returns" ? "rotate-180 text-[#1fe0bb]" : "text-white/40"
                      }`}
                    />
                  </button>
                  {openSection === "returns" && (
                    <div className="pt-3 text-xs text-emerald-100/70 space-y-2 leading-relaxed">
                      <p>
                        We offer a 7-day hassle-free exchange and return policy on undamaged pieces with intact security tags and original certificate packaging.
                      </p>
                      <Link
                        href="/returns-exchange"
                        className="inline-block text-[#1fe0bb] text-[0.68rem] font-semibold tracking-wider hover:underline pt-1"
                      >
                        Read Returns &amp; Exchange Terms →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Jewellery Care */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSection("care")}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/90 hover:text-[#1fe0bb] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1fe0bb]" />
                      Jewellery Care & Preservation
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSection === "care" ? "rotate-180 text-[#1fe0bb]" : "text-white/40"
                      }`}
                    />
                  </button>
                  {openSection === "care" && (
                    <div className="pt-3 text-xs text-emerald-100/70 space-y-2 leading-relaxed">
                      <p>
                        Avoid contact with perfume, moisture, and cleaning chemicals. Store your jewellery in the complimentary anti-tarnish suede pouch provided with your order.
                      </p>
                      <Link
                        href="/jewellery-care"
                        className="inline-block text-[#1fe0bb] text-[0.68rem] font-semibold tracking-wider hover:underline pt-1"
                      >
                        Read Care &amp; Maintenance Guide →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Client Reviews Section (Clean Empty State - No Fake Reviews) */}
          <section className="mt-14 sm:mt-20 border-t border-emerald-900/40 pt-10 sm:pt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[#1fe0bb] font-semibold">
                  Verified Collector Feedback
                </p>
                <h2
                  className="mt-1 text-2xl sm:text-3xl font-light text-white"
                  style={{ fontFamily: "var(--font-editorial), serif" }}
                >
                  Client Reviews
                </h2>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <div className="flex text-amber-400/40">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" />
                  ))}
                </div>
                <span>0 Reviews</span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-900/40 bg-[#06130e]/60 p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#1fe0bb]">
                <Star className="w-5 h-5 text-[#1fe0bb]/60" />
              </div>
              <h3 className="text-base font-medium text-white mb-2">No reviews yet</h3>
              <p className="text-xs text-emerald-100/60 max-w-md mx-auto leading-relaxed">
                Be the first to share your experience with this VINI VICI VIDI creation. Verified customers can submit their feedback directly through their order tracking page upon delivery.
              </p>
            </div>
          </section>
        </main>

        <FooterColumn />
      </div>
    </div>
  );
}
