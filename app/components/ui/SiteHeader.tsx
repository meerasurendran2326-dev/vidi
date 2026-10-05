"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  Menu,
  X,
  MessageCircle,
  ShoppingBag,
  User,
} from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartStore";
import { CartDrawer } from "@/app/components/ui/CartDrawer";

function HeaderJewelryPattern({ patternId }: { patternId: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl"
    >
      <svg
        className="w-full h-full opacity-65"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="32,2 62,32 32,62 2,32"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              opacity="0.22"
            />
            <polygon
              points="32,14 50,32 32,50 14,32"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.65"
              opacity="0.16"
            />
            <line
              x1="0"
              y1="0"
              x2="64"
              y2="64"
              stroke="#FFFFFF"
              strokeWidth="0.45"
              opacity="0.14"
            />
            <line
              x1="64"
              y1="0"
              x2="0"
              y2="64"
              stroke="#FFFFFF"
              strokeWidth="0.45"
              opacity="0.14"
            />
            <line
              x1="32"
              y1="22"
              x2="32"
              y2="42"
              stroke="#FFFFFF"
              strokeWidth="1.1"
              opacity="0.32"
            />
            <line
              x1="22"
              y1="32"
              x2="42"
              y2="32"
              stroke="#FFFFFF"
              strokeWidth="1.1"
              opacity="0.32"
            />
            <circle cx="32" cy="32" r="1.5" fill="#FFFFFF" opacity="0.45" />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" opacity="0.28" />
            <circle cx="64" cy="0" r="2" fill="#FFFFFF" opacity="0.28" />
            <circle cx="0" cy="64" r="2" fill="#FFFFFF" opacity="0.28" />
            <circle cx="64" cy="64" r="2" fill="#FFFFFF" opacity="0.28" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#0B4A3B]/45 pointer-events-none" />
    </div>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const { wishlistCount, setIsDrawerOpen } = useWishlist();
  const { itemCount } = useCart();

  return (
    <header className="site-header sticky top-0 z-40 px-2 xs:px-3 sm:px-[3.2vw] pt-2.5 sm:pt-5">
      <nav className="relative flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 px-3 sm:px-7 py-2 sm:py-3.5 border border-[#E6F2EA]/20 bg-[#0B4A3B] text-[#FFFFFF] uppercase text-[0.68rem] shadow-xl shadow-[#0B4A3B]/25 rounded-2xl">
        <HeaderJewelryPattern patternId="header-white-jewelry-pattern" />
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[280px] h-[180px] bg-gradient-to-br from-[#1F7A5C]/25 via-transparent to-transparent blur-[80px] pointer-events-none z-0"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-[220px] h-[140px] bg-radial from-[#1fe0bb]/10 to-transparent blur-[70px] pointer-events-none z-0"
        />

        {/* Logo (left) */}
        <Link
          href="/"
          className="relative z-10 flex items-center gap-2 sm:gap-3.5 group shrink min-w-0"
        >
          <div className="relative p-0.5 sm:p-1 bg-white rounded-lg shadow-md border border-[#E6F2EA]/40 group-hover:scale-105 transition-transform shrink-0">
            <Image
              src="/logo.jpg"
              alt="VINI VICI VIDI"
              width={36}
              height={36}
              sizes="36px"
              className="h-7 w-7 sm:h-9 sm:w-9 object-contain rounded-md"
            />
          </div>
          <div className="flex flex-col items-start min-w-0">
            <div
              className="font-bold tracking-[0.08em] sm:tracking-[0.14em] text-xs sm:text-base text-[#FFFFFF] truncate"
              style={{ wordSpacing: "0.2em" }}
            >
              VINI VICI VIDI
            </div>
            <div className="hidden xs:block text-[0.48rem] sm:text-[0.56rem] tracking-[0.12em] sm:tracking-[0.14em] text-[#E6F2EA]/80 uppercase font-medium truncate">
              Pure 925 Silver Jewellery
            </div>
          </div>
        </Link>

        {/* Center navigation (desktop with animated white sliding pill) */}
        <div
          className="relative z-10 hidden md:flex items-center p-1 rounded-full border border-[#E6F2EA]/20 bg-[#0B4A3B]/50 backdrop-blur-md"
          onMouseLeave={() => {
            setPosition((pv) => ({ ...pv, opacity: 0 }));
            setHoveredTab(null);
          }}
        >
          <motion.div
            animate={position}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="absolute z-0 h-7 md:h-8 rounded-full bg-white shadow-md shadow-black/10 pointer-events-none"
          />

          <div
            className="relative z-10"
            onMouseEnter={(e) => {
              const rect = e.currentTarget;
              setPosition({
                width: rect.offsetWidth,
                opacity: 1,
                left: rect.offsetLeft,
              });
              setHoveredTab("shop");
              setShopDropdownOpen(true);
            }}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button
              className={`px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 uppercase tracking-wider font-semibold text-[0.68rem] whitespace-nowrap ${
                hoveredTab === "shop"
                  ? "text-[#0B4A3B]"
                  : "text-[#E6F2EA] hover:text-white"
              }`}
            >
              SHOP
              <span
                className={`text-[0.55rem] transition-colors ${hoveredTab === "shop" ? "text-[#0B4A3B]" : "text-[#1fe0bb]"}`}
              >
                ▼
              </span>
            </button>
            {shopDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#0B4A3B] border border-[#E6F2EA]/20 shadow-2xl rounded-xl py-2 flex flex-col gap-1 z-50 overflow-hidden">
                <HeaderJewelryPattern patternId="header-shop-jewelry-pattern" />
                {[
                  { name: "Ring", href: "/rings" },
                  { name: "Pendent Set", href: "/pendent-set" },
                  { name: "Bracelet", href: "/bracelet" },
                  { name: "Stud", href: "/stud" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative z-10 px-4 py-2 hover:text-white hover:translate-x-1 transition-all duration-150 text-left text-xs tracking-wider text-[#E6F2EA]/80 font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#story"
            onMouseEnter={(e) => {
              const rect = e.currentTarget;
              setPosition({
                width: rect.offsetWidth,
                opacity: 1,
                left: rect.offsetLeft,
              });
              setHoveredTab("story");
            }}
            className={`relative z-10 px-4 py-1.5 rounded-full tracking-wider transition-colors font-semibold text-[0.68rem] whitespace-nowrap ${
              hoveredTab === "story"
                ? "text-[#0B4A3B]"
                : "text-[#E6F2EA] hover:text-white"
            }`}
          >
            OUR STORY
          </a>

          <a
            href="#contact"
            onMouseEnter={(e) => {
              const rect = e.currentTarget;
              setPosition({
                width: rect.offsetWidth,
                opacity: 1,
                left: rect.offsetLeft,
              });
              setHoveredTab("contact");
            }}
            className={`relative z-10 px-4 py-1.5 rounded-full tracking-wider transition-colors flex items-center gap-1.5 font-semibold text-[0.68rem] whitespace-nowrap ${
              hoveredTab === "contact"
                ? "text-[#0B4A3B]"
                : "text-[#E6F2EA] hover:text-white"
            }`}
          >
            CONTACT
            <MessageCircle
              className={`w-3.5 h-3.5 transition-colors ${hoveredTab === "contact" ? "text-[#0B4A3B]" : "text-[#1fe0bb]"}`}
            />
          </a>
        </div>

        {/* Right side actions */}
        <div className="relative z-10 flex items-center gap-1.5 xs:gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <button
              aria-label="Search"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center hover:bg-[#E6F2EA] hover:text-[#1F7A5C] hover:scale-110 shadow-md transition-all duration-200"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <Link
              href="/account"
              aria-label="Atelier Client Account"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center hover:bg-[#E6F2EA] hover:text-[#1F7A5C] hover:scale-110 shadow-md transition-all duration-200"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <button
              aria-label="Wishlist"
              onClick={() => setIsDrawerOpen(true)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center hover:bg-[#E6F2EA] hover:text-[#1F7A5C] hover:scale-110 shadow-md transition-all duration-200"
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlistCount > 0 ? "fill-rose-500 stroke-rose-500" : ""}`}
              />
              {wishlistCount > 0 ? (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[0.58rem] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {wishlistCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1fe0bb] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1fe0bb]" />
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label={`Shopping bag, ${itemCount} items`}
              onClick={() => setCartOpen(true)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center hover:bg-[#E6F2EA] hover:text-[#1F7A5C] hover:scale-110 shadow-md transition-all duration-200"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-[#1fe0bb] px-1 text-[0.58rem] font-bold text-[#03251c] flex items-center justify-center shadow-md">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <Link
            href="/account"
            aria-label="Client Account"
            className="sm:hidden relative w-8 h-8 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center shadow-md shrink-0"
          >
            <User className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            aria-label={`Shopping bag, ${itemCount} items`}
            onClick={() => setCartOpen(true)}
            className="sm:hidden relative w-8 h-8 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center shadow-md shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-[#1fe0bb] px-1 text-[0.55rem] font-bold text-[#03251c] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="hidden sm:inline-flex px-4 py-2 rounded-full bg-white text-[#0B4A3B] font-semibold hover:bg-[#E6F2EA] hover:text-[#1F7A5C] transition-all tracking-[0.2em] shadow-md items-center justify-center gap-2 text-xs"
          >
            <span>FAVORITES</span>
            <span className="bg-[#0B4A3B] text-[#E6F2EA] px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold">
              {wishlistCount}
            </span>
          </button>

          <button
            className="md:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center hover:bg-[#E6F2EA] hover:text-[#1F7A5C] shadow-md transition-all shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-2 right-2 xs:left-3 xs:right-3 sm:left-[3.2vw] sm:right-[3.2vw] mt-2 bg-[#0B4A3B] border border-[#E6F2EA]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col uppercase text-[0.7rem] text-[#FFFFFF] z-50">
          <HeaderJewelryPattern patternId="header-mobile-jewelry-pattern" />
          <div className="relative z-10 p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3 pb-6 border-b border-[#E6F2EA]/20">
              <span className="text-[#FFFFFF] font-bold tracking-[0.25em] text-[0.65rem]">
                SHOP
              </span>
              <div className="grid grid-cols-2 gap-4 pl-2">
                {[
                  { name: "Ring", href: "/rings" },
                  { name: "Pendent Set", href: "/pendent-set" },
                  { name: "Bracelet", href: "/bracelet" },
                  { name: "Stud", href: "/stud" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="hover:text-white text-[#E6F2EA]/80 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="#story"
              className="hover:text-white text-[#E6F2EA] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              OUR STORY
            </a>
            <a
              href="#contact"
              className="hover:text-white text-[#E6F2EA] transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              CONTACT
              <MessageCircle className="w-4 h-4 text-[#1fe0bb]" />
            </a>
            <Link
              href="/account"
              className="hover:text-white text-[#E6F2EA] transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              CLIENT ACCOUNT
              <User className="w-4 h-4 text-[#1fe0bb]" />
            </Link>

            <div className="flex items-center justify-between pt-6 border-t border-[#E6F2EA]/20">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Wishlist"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDrawerOpen(true);
                  }}
                  className="w-10 h-10 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center hover:bg-[#E6F2EA] hover:text-[#1F7A5C] shadow-md transition-all relative"
                >
                  <Heart
                    className={`w-4 h-4 ${wishlistCount > 0 ? "fill-rose-500 stroke-rose-500" : ""}`}
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-white text-[#0B4A3B] font-semibold hover:bg-[#E6F2EA] hover:text-[#1F7A5C] transition-all tracking-[0.2em] shadow-md flex items-center justify-center gap-2 text-xs"
              >
                <span>Favorites</span>
                <span className="bg-[#0B4A3B] text-[#E6F2EA] px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold">
                  {wishlistCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
