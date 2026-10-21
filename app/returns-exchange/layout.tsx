import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description:
    "Our guidelines on returns, exchanges, sizing adjustments, and refund procedures for genuine VINI VICI VIDI creations.",
  alternates: {
    canonical: "/returns-exchange",
  },
};

export default function ReturnsExchangeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
