"use client";

import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const data = {
  company: {
    name: "VINI VICI VIDI",
    tagline: "Pure 925 Sterling Silver Atelier",
    description:
      "Crafting architectural modern silver haute joaillerie. Each creation embodies timeless balance, pure 925 silver hallmarks, and master artisan dedication.",
    logo: "/logo.jpg",
  },
  socials: [
    { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
    { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
    { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
    { icon: MessageCircle, label: "WhatsApp", href: "https://whatsapp.com" },
  ],
  collections: [
    { text: "Rings & Signets", href: "/rings" },
    { text: "Pendants", href: "/pendent-set" },
    { text: "Bracelets", href: "/bracelet" },
    { text: "Studs", href: "/stud" },
    { text: "All Jewellery", href: "/shop" },
  ],
  atelier: [
    { text: "Our Story", href: "/about" },
    { text: "Jewellery Care", href: "/jewellery-care" },
    { text: "Size Guide", href: "/size-guide" },
    { text: "FAQ", href: "/faq" },
    { text: "Contact Us", href: "/contact" },
  ],
  clientCare: [
    { text: "Track Order", href: "/track-order" },
    { text: "Shipping Policy", href: "/shipping-policy" },
    { text: "Returns & Exchange", href: "/returns-exchange" },
    { text: "Size Guide", href: "/size-guide" },
    { text: "Live Concierge", href: "/contact", hasIndicator: true },
  ],
  contact: [
    { icon: Mail, text: "[CLIENT TO PROVIDE EMAIL]" },
    { icon: Phone, text: "[CLIENT TO PROVIDE PHONE]" },
    { icon: MapPin, text: "[CLIENT TO PROVIDE ADDRESS]", isAddress: true },
  ],
};

export function FooterColumn() {
  return (
    <footer className="relative w-full bg-[#0B4A3B] text-[#FFFFFF] border-t-2 border-[#E6F2EA]/20 overflow-hidden">
      {/* Intricate White Geometric Design Pattern */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <svg className="w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="white-jewelry-pattern" width="64" height="64" patternUnits="userSpaceOnUse">
              {/* Outer diamond grid */}
              <polygon points="32,2 62,32 32,62 2,32" fill="none" stroke="#FFFFFF" strokeWidth="0.85" opacity="0.22" />
              {/* Inner diamond facet */}
              <polygon points="32,14 50,32 32,50 14,32" fill="none" stroke="#FFFFFF" strokeWidth="0.65" opacity="0.16" />
              {/* Diagonal connecting lattice */}
              <line x1="0" y1="0" x2="64" y2="64" stroke="#FFFFFF" strokeWidth="0.45" opacity="0.14" />
              <line x1="64" y1="0" x2="0" y2="64" stroke="#FFFFFF" strokeWidth="0.45" opacity="0.14" />
              {/* Central jewel sparkle star */}
              <line x1="32" y1="22" x2="32" y2="42" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.32" />
              <line x1="22" y1="32" x2="42" y2="32" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.32" />
              <circle cx="32" cy="32" r="1.5" fill="#FFFFFF" opacity="0.45" />
              {/* Corner intersection dots */}
              <circle cx="0" cy="0" r="2" fill="#FFFFFF" opacity="0.28" />
              <circle cx="64" cy="0" r="2" fill="#FFFFFF" opacity="0.28" />
              <circle cx="0" cy="64" r="2" fill="#FFFFFF" opacity="0.28" />
              <circle cx="64" cy="64" r="2" fill="#FFFFFF" opacity="0.28" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#white-jewelry-pattern)" />
        </svg>

        {/* Soft white sheen gradient overlays over the pattern for depth */}
        <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#0B4A3B]/45 pointer-events-none" />
      </div>

      {/* Subtle emerald ambient glows */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#1F7A5C]/25 via-transparent to-transparent blur-[120px] pointer-events-none z-0" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial from-[#1fe0bb]/10 to-transparent blur-[100px] pointer-events-none z-0" 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 pb-8 sm:px-8 lg:px-12 lg:pt-20">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 sm:gap-3.5 group">
              <div className="relative group-hover:scale-105 transition-transform shrink-0">
                <img
                  src={data.company.logo}
                  alt={data.company.name}
                  className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-[0.12em] sm:tracking-[0.14em] text-[#FFFFFF]" style={{ wordSpacing: "0.25em" }}>
                  {data.company.name}
                </span>
                <span className="text-[0.55rem] sm:text-[0.62rem] tracking-[0.16em] sm:tracking-[0.18em] text-[#E6F2EA]/80 uppercase font-medium">
                  {data.company.tagline}
                </span>
              </div>
            </Link>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#E6F2EA]/85 leading-relaxed max-w-sm font-sans font-light">
              {data.company.description}
            </p>

            {/* Social Icons */}
            <div className="mt-6 sm:mt-8 flex items-center gap-2.5 sm:gap-3">
              {data.socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#0B4A3B] flex items-center justify-center hover:bg-[#E6F2EA] hover:text-[#1F7A5C] hover:scale-110 shadow-md transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns: 2-column grid on mobile, 4-column on desktop */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-7 sm:gap-y-8">
            {/* Column 1: Collections */}
            <div>
              <p className="text-[0.68rem] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#FFFFFF] border-b border-[#E6F2EA]/20 pb-2.5 sm:pb-3">
                Collections
              </p>
              <ul className="mt-3.5 sm:mt-5 space-y-2.5 sm:space-y-3.5 text-xs text-[#E6F2EA]/80 font-medium">
                {data.collections.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-150 text-[0.72rem] sm:text-xs"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Atelier & Story */}
            <div>
              <p className="text-[0.68rem] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#FFFFFF] border-b border-[#E6F2EA]/20 pb-2.5 sm:pb-3">
                Atelier
              </p>
              <ul className="mt-3.5 sm:mt-5 space-y-2.5 sm:space-y-3.5 text-xs text-[#E6F2EA]/80 font-medium">
                {data.atelier.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-150 text-[0.72rem] sm:text-xs"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Client Care & Live Concierge */}
            <div>
              <p className="text-[0.68rem] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#FFFFFF] border-b border-[#E6F2EA]/20 pb-2.5 sm:pb-3">
                Client Care
              </p>
              <ul className="mt-3.5 sm:mt-5 space-y-2.5 sm:space-y-3.5 text-xs text-[#E6F2EA]/80 font-medium">
                {data.clientCare.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`inline-flex items-center gap-1.5 sm:gap-2 hover:text-white hover:translate-x-1 transition-all duration-150 text-[0.72rem] sm:text-xs ${
                        hasIndicator ? "text-white font-semibold" : ""
                      }`}
                    >
                      <span>{text}</span>
                      {hasIndicator && (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1fe0bb] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1fe0bb]" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Concierge (Full width on mobile across the 2 cols for clean address & email formatting) */}
            <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 border-[#E6F2EA]/15 pt-5 sm:pt-0">
              <p className="text-[0.68rem] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#FFFFFF] border-b border-[#E6F2EA]/20 pb-2.5 sm:pb-3">
                Contact
              </p>
              <ul className="mt-3.5 sm:mt-5 space-y-3 sm:space-y-4 text-xs text-[#E6F2EA]/85">
                {data.contact.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-white/10 text-white shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isAddress ? (
                      <address className="not-italic leading-relaxed font-light text-[0.72rem] sm:text-xs">
                        {text}
                      </address>
                    ) : (
                      <span className="leading-relaxed font-light text-[0.72rem] sm:text-xs break-all sm:break-normal">{text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[#E6F2EA]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.62rem] sm:text-[0.68rem] tracking-[0.1em] sm:tracking-[0.15em] uppercase text-[#E6F2EA]/75 text-center sm:text-left">
          <p className="max-w-xs sm:max-w-none">
            &copy; {new Date().getFullYear()} {data.company.name} MAISON. ALL RIGHTS RESERVED.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#E6F2EA]/40">•</span>
            <Link href="/terms-conditions" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#E6F2EA]/40">•</span>
            <Link href="/size-guide" className="hover:text-white transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#1fe0bb]" />
              Hallmark Guarantee
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
