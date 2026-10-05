import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { Plus, Pencil } from "lucide-react";

export const metadata = { title: "Products | Admin — VINI VICI VIDI" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ active: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      price: true,
      stock: true,
      active: true,
      images: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
            Catalog
          </p>
          <h1
            className="mt-1 text-3xl font-normal text-white"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#1fe0bb] px-5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-lg shadow-[#1fe0bb]/20"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-emerald-900/30">
          {["Product", "Category", "Price", "Stock", "Status", ""].map((h) => (
            <span
              key={h}
              className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-500"
            >
              {h}
            </span>
          ))}
        </div>

        {products.length === 0 && (
          <p className="py-12 text-center text-xs text-slate-500">
            No products found. Add your first product.
          </p>
        )}

        <div className="divide-y divide-emerald-900/20">
          {products.map((p) => (
            <div
              key={p.id}
              className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${
                !p.active ? "opacity-50" : ""
              }`}
            >
              {/* Name + image */}
              <div className="flex items-center gap-3 min-w-0">
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-9 w-9 rounded-lg object-cover shrink-0 border border-emerald-900/30"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                  <p className="text-[0.62rem] text-slate-500 truncate">{p.slug}</p>
                </div>
              </div>

              <span className="text-[0.65rem] text-slate-400 whitespace-nowrap">
                {p.category}
              </span>

              <span className="text-xs font-semibold text-white tabular-nums whitespace-nowrap">
                ₹{Number(p.price).toLocaleString("en-IN")}
              </span>

              <span
                className={`text-xs font-semibold tabular-nums ${
                  p.stock === 0
                    ? "text-rose-400"
                    : p.stock <= 5
                    ? "text-amber-400"
                    : "text-emerald-300"
                }`}
              >
                {p.stock}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider whitespace-nowrap ${
                  p.active
                    ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                    : "border border-slate-700 bg-slate-900/60 text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${p.active ? "bg-emerald-400" : "bg-slate-600"}`}
                />
                {p.active ? "Active" : "Inactive"}
              </span>

              <Link
                href={`/admin/products/${p.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-900/40 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-slate-400 transition-all hover:border-[#1fe0bb]/40 hover:text-[#1fe0bb]"
              >
                <Pencil className="h-3 w-3" /> Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
