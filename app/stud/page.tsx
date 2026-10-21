import type { Metadata } from "next";
import { JewelleryPageLayout } from "@/app/components/ui/JewelleryPageLayout";
import {
  getProductsByCategory,
  jewelleryCategoryInfo,
} from "@/app/data/jewellery-products";

export const metadata: Metadata = {
  title: "925 Sterling Silver Studs & Earrings Collection",
  description:
    "Handcrafted 925 sterling silver studs, architectural huggies, and drop earrings. Minimalist geometry forged in high-polish pure silver.",
  alternates: {
    canonical: "/stud",
  },
  openGraph: {
    title: "925 Sterling Silver Studs & Earrings | VINI VICI VIDI",
    description:
      "Handcrafted 925 sterling silver studs, architectural huggies, and drop earrings. Minimalist geometry forged in high-polish pure silver.",
    url: "/stud",
  },
};

export default function StudPage() {
  const category = jewelleryCategoryInfo.stud;
  return (
    <JewelleryPageLayout
      category={category.title}
      tagline={category.tagline}
      description={category.description}
      products={getProductsByCategory("stud")}
    />
  );
}
