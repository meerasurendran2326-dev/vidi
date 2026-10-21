import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Silver Atelier",
  description:
    "Learn about VINI VICI VIDI — the heritage, philosophy, and artisan craftsmanship behind our pure 925 sterling silver jewellery collections.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Our Silver Atelier | VINI VICI VIDI",
    description:
      "Learn about VINI VICI VIDI — the heritage, philosophy, and artisan craftsmanship behind our pure 925 sterling silver jewellery collections.",
    url: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
