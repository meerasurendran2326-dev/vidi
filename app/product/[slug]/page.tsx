import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/app/components/ui/ProductDetails";
import {
  getProductBySlug,
  jewelleryProducts,
} from "@/app/data/jewellery-products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return jewelleryProducts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | VINI VICI VIDI" };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinivicividi.com";
  const url = `${baseUrl}/product/${product.slug}`;
  const description = product.description || product.subtitle;
  const image = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  return {
    title: `${product.name} | VINI VICI VIDI Pure 925 Silver`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${product.name} — VINI VICI VIDI`,
      description,
      url,
      siteName: "VINI VICI VIDI Atelier",
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinivicividi.com";
  const numericPrice = product.price.replace(/[^\d.]/g, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.subtitle,
    image: [
      product.image.startsWith("http")
        ? product.image
        : `${baseUrl}${product.image}`,
    ],
    brand: {
      "@type": "Brand",
      name: "VINI VICI VIDI",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "INR",
      price: numericPrice,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails key={product.id} product={product} />
    </>
  );
}
