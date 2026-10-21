import type { Metadata } from "next";
import { JewelleryPageLayout } from "@/app/components/ui/JewelleryPageLayout";
import {
  getProductsByCategory,
  jewelleryCategoryInfo,
} from "@/app/data/jewellery-products";

export const metadata: Metadata = {
  title: "925 Sterling Silver Pendants & Sets Collection",
  description:
    "Luxury 925 sterling silver pendants and talisman medallion sets by VINI VICI VIDI. Hand-finished silver chains with deep architectural Latin motifs.",
  alternates: {
    canonical: "/pendent-set",
  },
  openGraph: {
    title: "925 Sterling Silver Pendants & Sets | VINI VICI VIDI",
    description:
      "Luxury 925 sterling silver pendants and talisman medallion sets by VINI VICI VIDI. Hand-finished silver chains with deep architectural Latin motifs.",
    url: "/pendent-set",
  },
};

export default function PendentSetPage() {
  const category = jewelleryCategoryInfo["pendent-set"];
  return (
    <JewelleryPageLayout
      category={category.title}
      tagline={category.tagline}
      description={category.description}
      products={getProductsByCategory("pendent-set")}
    />
  );
}
