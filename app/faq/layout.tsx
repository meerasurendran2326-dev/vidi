import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers regarding 925 sterling silver authenticity, sizing, shipping, custom atelier orders, and care instructions at VINI VICI VIDI.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
