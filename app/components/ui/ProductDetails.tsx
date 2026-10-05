"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { addProductToCart } from "@/app/context/CartStore";
import { useWishlist } from "@/app/context/WishlistContext";
import { ShaderBackground } from "@/components/ui/adisyon-shader";
import type { JewelleryProduct } from "@/app/data/jewellery-products";

interface ProductDetailsProps {
  product: JewelleryProduct;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
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
    if (addProductToCart(product, quantity)) {
      setCartMessage(
        `${quantity} ${quantity === 1 ? "item" : "items"} added to your bag.`,
      );
    }
  };

  const buyNow = () => {
    if (addProductToCart(product, quantity)) router.push("/checkout");
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
                <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-5 sm:gap-3">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={selectedImage === index}
                      className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                        selectedImage === index
                          ? "border-emerald-300"
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

              <div className="mt-7 flex flex-wrap items-center gap-4">
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
                    className="grid h-10 w-10 place-items-center text-white transition-colors hover:text-emerald-300 disabled:opacity-40"
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
                    className="grid h-10 w-10 place-items-center text-white transition-colors hover:text-emerald-300 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={unavailable}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-700 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={unavailable}
                  className="min-h-12 rounded-full bg-[#1fe0bb] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#03251c] shadow-lg transition-colors hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="grid h-12 w-12 place-items-center justify-self-start rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-rose-300/60 hover:text-rose-300 sm:justify-self-end"
                >
                  <Heart
                    className={`h-5 w-5 ${saved ? "fill-rose-400 text-rose-400" : ""}`}
                  />
                </button>
              </div>

              <p
                role="status"
                aria-live="polite"
                className="mt-4 min-h-5 text-sm text-emerald-200/90"
              >
                {cartMessage}
              </p>
            </section>
          </div>
        </main>

        <FooterColumn />
      </div>
    </div>
  );
}
