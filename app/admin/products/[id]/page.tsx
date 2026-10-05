import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { ProductForm } from "@/app/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Edit Product | Admin — VINI VICI VIDI" };

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // "new" is a special case for the create flow
  if (id === "new") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-200/70 hover:text-[#1fe0bb] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Products
          </Link>
        </div>
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
            Catalog
          </p>
          <h1
            className="mt-1 text-3xl font-normal text-white"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            Add Product
          </h1>
        </div>
        <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 p-6">
          <ProductForm />
        </div>
      </div>
    );
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      price: true,
      stock: true,
      active: true,
    },
  });

  if (!product) notFound();

  const productForForm = {
    ...product,
    price: product.price.toFixed(2),
    stock: product.stock.toString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-200/70 hover:text-[#1fe0bb] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Products
        </Link>
      </div>
      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
          Catalog
        </p>
        <h1
          className="mt-1 text-3xl font-normal text-white"
          style={{ fontFamily: "var(--font-editorial), serif" }}
        >
          Edit Product
        </h1>
        <p className="mt-1 text-xs text-slate-500">{product.name}</p>
      </div>
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 p-6">
        <ProductForm product={productForForm} />
      </div>
    </div>
  );
}
