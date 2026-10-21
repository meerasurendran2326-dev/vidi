import type { Metadata, Viewport } from "next";
import {
  Inter,
  Cormorant_Garamond,
  Montserrat,
  Bebas_Neue,
} from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { WishlistDrawer } from "@/app/components/ui/WishlistDrawer";

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-gothic",
  subsets: ["latin"],
  weight: ["400"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#011811",
};

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://vinivicividi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VINI VICI VIDI | Luxury 925 Sterling Silver Jewellery Atelier",
    template: "%s | VINI VICI VIDI",
  },
  description:
    "Discover handcrafted luxury 925 sterling silver rings, bracelets, pendants, and studs. Hand-finished silver creations blending timeless Latin heritage and modern luxury.",
  keywords: [
    "925 sterling silver",
    "luxury silver jewellery",
    "pure silver rings",
    "silver signet rings",
    "silver bracelets",
    "silver pendants",
    "artisan silver jewellery",
    "VINI VICI VIDI",
  ],
  authors: [{ name: "VINI VICI VIDI" }],
  creator: "VINI VICI VIDI",
  publisher: "VINI VICI VIDI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VINI VICI VIDI | Luxury 925 Sterling Silver Jewellery Atelier",
    description:
      "Handcrafted luxury 925 sterling silver rings, bracelets, pendants, and studs. Hand-finished silver creations blending timeless Latin heritage and modern luxury.",
    url: siteUrl,
    siteName: "VINI VICI VIDI",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "VINI VICI VIDI Luxury 925 Sterling Silver",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VINI VICI VIDI | Luxury 925 Sterling Silver Jewellery Atelier",
    description:
      "Handcrafted luxury 925 sterling silver rings, bracelets, pendants, and studs.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "google-site-verification-placeholder",
  },
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "VINI VICI VIDI",
  url: siteUrl,
  logo: `${siteUrl}/logo.jpg`,
  description:
    "Handcrafted luxury 925 sterling silver rings, bracelets, pendants, and studs. Hand-finished silver creations blending timeless Latin heritage and modern luxury.",
  currenciesAccepted: "INR",
  paymentAccepted: "Credit Card, Debit Card, UPI, NetBanking",
  priceRange: "₹₹₹",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${montserrat.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="/vini-vici-vidi-mobile-logo-reveal.mp4"
          as="video"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          href="/vvv-logo-reveal.mp4"
          as="video"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#011811] text-[#f2f2f2]">
        <WishlistProvider>
          {children}
          <WishlistDrawer />
        </WishlistProvider>
      </body>
    </html>
  );
}
