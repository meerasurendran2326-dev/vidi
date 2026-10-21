import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/app/components/ui/ProductDetails";
import {
  getProductBySlug,
  jewelleryProducts,
  type JewelleryProduct,
} from "@/app/data/jewellery-products";
import { prisma } from "@/app/lib/prisma";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return jewelleryProducts.map(({ slug }) => ({ slug }));
}

async function resolveProduct(slug: string): Promise<JewelleryProduct | null> {
  const local = getProductBySlug(slug);
  if (local) return local;

  try {
    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (dbProduct) {
      return {
        id: dbProduct.id,
        slug: dbProduct.slug,
        category: (dbProduct.category as any) || "rings",
        name: dbProduct.name,
        subtitle: dbProduct.description ? dbProduct.description.slice(0, 60) : "Pure 925 Sterling Silver Atelier",
        description: dbProduct.description || undefined,
        price: `₹${Number(dbProduct.price).toLocaleString("en-IN")}`,
        image: dbProduct.images?.[0] || "/images/custom/img1.jpeg",
        images: dbProduct.images?.length ? dbProduct.images : ["/images/custom/img1.jpeg"],
        stock: dbProduct.stock,
      };
    }
  } catch {
    // Database fallback gracefully fails to null
  }

  return null;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) return { title: "Product Not Found | VINI VICI VIDI" };

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://vinivicividi.com";
  const url = `${baseUrl}/product/${product.slug}`;
  const description =
    product.description ||
    product.subtitle ||
    `Handcrafted ${product.name} in solid 925 sterling silver by VINI VICI VIDI.`;
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
      title: `${product.name} — VINI VICI VIDI Pure 925 Silver`,
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
      title: `${product.name} | VINI VICI VIDI`,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://vinivicividi.com";
  const numericPrice = product.price.replace(/[^\d.]/g, "");

  const availability =
    product.stock !== undefined && product.stock <= 0
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";

  const allImages = (
    product.images && product.images.length > 0
      ? product.images
      : [product.image]
  ).map((img) => (img.startsWith("http") ? img : `${baseUrl}${img}`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.subtitle,
    image: allImages,
    sku: product.id,
    material: "925 Sterling Silver",
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "VINI VICI VIDI",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "INR",
      price: numericPrice,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "VINI VICI VIDI",
      },
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
