import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ring & Bracelet Size Guide",
  description:
    "Accurate ring size conversion charts (Indian, US, UK, EU) and wrist measurement guides for VINI VICI VIDI jewellery.",
  alternates: {
    canonical: "/size-guide",
  },
};

export default function SizeGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
