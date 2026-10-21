import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Pure 925 Silver Jewellery",
  description:
    "Explore the complete VINI VICI VIDI collection: handcrafted rings, bracelets, pendants, and studs in solid 925 sterling silver with emerald accents.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Pure 925 Silver Jewellery | VINI VICI VIDI",
    description:
      "Explore the complete VINI VICI VIDI collection: handcrafted rings, bracelets, pendants, and studs in solid 925 sterling silver with emerald accents.",
    url: "/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
