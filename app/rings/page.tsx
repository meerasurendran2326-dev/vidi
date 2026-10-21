import type { Metadata } from "next";
import { JewelleryPageLayout } from "@/app/components/ui/JewelleryPageLayout";
import {
  getProductsByCategory,
  jewelleryCategoryInfo,
} from "@/app/data/jewellery-products";

export const metadata: Metadata = {
  title: "925 Sterling Silver Rings Collection",
  description:
    "Explore handcrafted 925 sterling silver rings by VINI VICI VIDI. Featuring statement signet rings, solitaire bands, and liquid emerald chrome detailing.",
  alternates: {
    canonical: "/rings",
  },
  openGraph: {
    title: "925 Sterling Silver Rings Collection | VINI VICI VIDI",
    description:
      "Explore handcrafted 925 sterling silver rings by VINI VICI VIDI. Featuring statement signet rings, solitaire bands, and liquid emerald chrome detailing.",
    url: "/rings",
  },
};

export default function RingsPage() {
  const category = jewelleryCategoryInfo.rings;
  return (
    <JewelleryPageLayout
      category={category.title}
      tagline={category.tagline}
      description={category.description}
      products={getProductsByCategory("rings")}
    />
  );
}
