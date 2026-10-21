import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "925 Sterling Silver Care & Preservation",
  description:
    "Expert guidelines on maintaining the brilliance, luster, and longevity of your solid 925 sterling silver and emerald jewellery.",
  alternates: {
    canonical: "/jewellery-care",
  },
};

export default function JewelleryCareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
