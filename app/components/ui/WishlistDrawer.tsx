"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import Link from "next/link";

export function WishlistDrawer() {
  const { wishlist, isDrawerOpen, setIsDrawerOpen, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();

  const handleWhatsAppOrder = (item?: { name: string; price: string }) => {
    let msg = "Hi VINI VICI VIDI Atelier! ";
    if (item) {
      msg += `I am interested in ordering the ${item.name} (${item.price}). Please assist me with availability.`;
    } else {
      const itemList = wishlist.map((i) => `• ${i.name} (${i.price})`).join("\n");
      msg += `I have saved the following items in my favorites:\n\n${itemList}\n\nPlease assist me with placing this order.`;
    }
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 pointer-events-auto"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0B4A3B] text-white border-l border-[#E6F2EA]/20 shadow-2xl z-50 flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-[#E6F2EA]/20 flex items-center justify-between bg-gradient-to-r from-[#0B4A3B] to-[#1F7A5C]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#1fe0bb] border border-white/15">
                  <Heart className="w-4 h-4 fill-[#1fe0bb] stroke-[#1fe0bb]" />
                </div>
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-display)" }}>
                    Atelier Favorites
                  </h2>
                  <p className="text-[0.68rem] tracking-widest text-[#E6F2EA]/75 uppercase">
                    {wishlistCount} {wishlistCount === 1 ? "Item" : "Items"} Saved
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Close wishlist drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#E6F2EA]/40">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-white uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Your Favorites List is Empty
                  </h3>
                  <p className="text-xs text-[#E6F2EA]/70 max-w-xs leading-relaxed mb-6 font-light">
                    Explore our 925 Sterling Silver Atelier collections and tap the heart icon on any piece to save your favorite designs.
                  </p>
                  <Link
                    href="/rings"
                    onClick={() => setIsDrawerOpen(false)}
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold text-[#0B4A3B] bg-white hover:bg-[#E6F2EA] px-6 py-3 rounded-full transition-all shadow-lg"
                  >
                    <span>Explore Atelier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[0.65rem] tracking-widest uppercase text-[#E6F2EA]/70 font-semibold">
                      Saved Creations
                    </span>
                    <button
                      onClick={clearWishlist}
                      className="text-[0.62rem] tracking-wider uppercase text-rose-300 hover:text-rose-200 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {wishlist.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="group relative flex gap-4 p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md transition-all hover:border-[#1fe0bb]/40"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black/40 relative border border-white/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div>
                          {product.subtitle && (
                            <p className="text-[0.58rem] tracking-widest uppercase text-[#1fe0bb] font-semibold truncate">
                              {product.subtitle}
                            </p>
                          )}
                          <h4 className="text-xs font-semibold text-white leading-snug truncate" style={{ fontFamily: "var(--font-editorial)" }}>
                            {product.name}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                          <span className="text-sm font-bold text-[#E6F2EA]">
                            {product.price}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleWhatsAppOrder(product)}
                              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-transform active:scale-90"
                              title="Order via WhatsApp"
                              aria-label={`Enquire about ${product.name} on WhatsApp`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500/80 text-white/70 hover:text-white flex items-center justify-center transition-transform active:scale-90"
                              title="Remove from favorites"
                              aria-label={`Remove ${product.name} from favorites`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Footer Actions */}
            {wishlist.length > 0 && (
              <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-[#E6F2EA]/20 bg-black/20 backdrop-blur-md space-y-3">
                <button
                  onClick={() => handleWhatsAppOrder()}
                  className="w-full flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-bold text-[#0B4A3B] bg-[#1fe0bb] hover:bg-emerald-300 py-3.5 rounded-full transition-all shadow-xl active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order All Favorites via WhatsApp</span>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
