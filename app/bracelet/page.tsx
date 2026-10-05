import { JewelleryPageLayout } from "@/app/components/ui/JewelleryPageLayout";
import {
  getProductsByCategory,
  jewelleryCategoryInfo,
} from "@/app/data/jewellery-products";

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
