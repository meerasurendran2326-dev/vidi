import type { Metadata } from "next";
import { JewelleryPageLayout } from "@/app/components/ui/JewelleryPageLayout";
import {
  getProductsByCategory,
  jewelleryCategoryInfo,
} from "@/app/data/jewellery-products";

export const metadata: Metadata = {
  title: "925 Sterling Silver Bracelets & Cuffs Collection",
  description:
    "Discover artisan 925 sterling silver bracelets, heavy cuban chains, and liquid torque bangles crafted with precision by VINI VICI VIDI.",
  alternates: {
    canonical: "/bracelet",
  },
  openGraph: {
    title: "925 Sterling Silver Bracelets & Cuffs | VINI VICI VIDI",
    description:
      "Discover artisan 925 sterling silver bracelets, heavy cuban chains, and liquid torque bangles crafted with precision by VINI VICI VIDI.",
    url: "/bracelet",
  },
};

export default function BraceletPage() {
  const category = jewelleryCategoryInfo.bracelet;
  return (
    <JewelleryPageLayout
      category={category.title}
      tagline={category.tagline}
      description={category.description}
      products={getProductsByCategory("bracelet")}
    />
  );
}
