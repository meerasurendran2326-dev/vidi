import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { Plus, Pencil, AlertCircle, AlertTriangle, CheckCircle, Package } from "lucide-react";

export const metadata = { title: "Products & Stock Inventory | Admin — VINI VICI VIDI" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ stockFilter?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const currentFilter = sp.stockFilter ?? "ALL";

  const allProducts = await prisma.product.findMany({
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

  // Calculate stock metrics
  const totalCount = allProducts.length;
  const outOfStockCount = allProducts.filter((p) => p.stock <= 0).length;
  const lowStockCount = allProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const inStockCount = allProducts.filter((p) => p.stock > 5).length;
  const totalUnits = allProducts.reduce((sum, p) => sum + p.stock, 0);

  // Filter products for table display
  const products = allProducts.filter((p) => {
    if (currentFilter === "OUT") return p.stock <= 0;
    if (currentFilter === "LOW") return p.stock > 0 && p.stock <= 5;
    if (currentFilter === "IN") return p.stock > 5;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
            Catalog &amp; Inventory Management
          </p>
          <h1
            className="mt-1 text-3xl font-normal text-white"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            Products &amp; Stock Levels
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Monitor real-time product quantities, unavailable pieces, and restocking requirements.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#1fe0bb] px-5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-lg shadow-[#1fe0bb]/20 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Link>
      </div>

      {/* Stock Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Products */}
        <Link
          href="/admin/products"
          className={`rounded-2xl border p-4 sm:p-5 transition-all ${
            currentFilter === "ALL"
              ? "border-[#1fe0bb]/40 bg-[#042e22]/70 ring-1 ring-[#1fe0bb]/30"
              : "border-emerald-900/40 bg-[#010d08]/80 hover:border-emerald-700/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-slate-400">
              Total Catalog
            </span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{totalCount}</p>
          <p className="text-[0.68rem] text-slate-400 mt-0.5">{totalUnits} total units in stock</p>
        </Link>

        {/* Needs Immediate Restock (Out of stock) */}
        <Link
          href="/admin/products?stockFilter=OUT"
          className={`rounded-2xl border p-4 sm:p-5 transition-all ${
            currentFilter === "OUT"
              ? "border-rose-500/60 bg-rose-950/40 ring-1 ring-rose-500/40"
              : "border-rose-900/40 bg-rose-950/20 hover:border-rose-700/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-rose-300">
              Needs Restock (0 left)
            </span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-300">{outOfStockCount}</p>
          <p className="text-[0.68rem] text-rose-400/80 mt-0.5">Unavailable for purchase</p>
        </Link>

        {/* Low Stock Warning (1-5 units) */}
        <Link
          href="/admin/products?stockFilter=LOW"
          className={`rounded-2xl border p-4 sm:p-5 transition-all ${
            currentFilter === "LOW"
              ? "border-amber-500/60 bg-amber-950/40 ring-1 ring-amber-500/40"
              : "border-amber-900/40 bg-amber-950/20 hover:border-amber-700/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-amber-300">
              Low Stock (1–5 left)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-300">{lowStockCount}</p>
          <p className="text-[0.68rem] text-amber-400/80 mt-0.5">Prepare restock soon</p>
        </Link>

        {/* In Stock (> 5 units) */}
        <Link
          href="/admin/products?stockFilter=IN"
          className={`rounded-2xl border p-4 sm:p-5 transition-all ${
            currentFilter === "IN"
              ? "border-emerald-400/60 bg-emerald-950/40 ring-1 ring-emerald-400/40"
              : "border-emerald-900/40 bg-[#010d08]/80 hover:border-emerald-700/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-emerald-400">
              Healthy Stock (&gt; 5)
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{inStockCount}</p>
          <p className="text-[0.68rem] text-emerald-400/70 mt-0.5">Ample warehouse stock</p>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-[0.62rem] uppercase tracking-wider text-slate-500 font-bold mr-1">
          Filter by Stock:
        </span>
        {[
          { key: "ALL", label: `All Products (${totalCount})` },
          { key: "OUT", label: `Needs Restock (${outOfStockCount})` },
          { key: "LOW", label: `Low Stock (${lowStockCount})` },
          { key: "IN", label: `Healthy Stock (${inStockCount})` },
        ].map(({ key, label }) => (
          <Link
            key={key}
            href={key === "ALL" ? "/admin/products" : `/admin/products?stockFilter=${key}`}
            className={`px-3 py-1.5 rounded-full text-[0.62rem] font-bold uppercase tracking-wider transition-all ${
              currentFilter === key
                ? "bg-[#1fe0bb] text-[#03251c] shadow-md shadow-[#1fe0bb]/20"
                : "bg-white/5 text-slate-400 border border-emerald-900/40 hover:text-white"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-emerald-900/40 bg-[#010d08]/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-w-0">
          <div className="min-w-[700px]">
            {/* Table header */}
            <div className="grid grid-cols-[1.2fr_auto_auto_1.2fr_auto_auto] gap-4 px-5 py-3.5 border-b border-emerald-900/30 bg-white/[0.01]">
              {["Product", "Category", "Price", "Stock Level & Status", "Active", ""].map((h) => (
                <span
                  key={h}
                  className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-400"
                >
                  {h}
                </span>
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <p>No products match the selected stock filter ({currentFilter}).</p>
                <Link
                  href="/admin/products"
                  className="inline-block text-[#1fe0bb] text-[0.65rem] uppercase tracking-wider underline"
                >
                  Clear filter
                </Link>
              </div>
            )}

            <div className="divide-y divide-emerald-900/20">
              {products.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;

                return (
                  <div
                    key={p.id}
                    className={`grid grid-cols-[1.2fr_auto_auto_1.2fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${
                      !p.active ? "opacity-60" : ""
                    }`}
                  >
                    {/* Name + image */}
                    <div className="flex items-center gap-3 min-w-0">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0 border border-emerald-900/40 bg-black/40"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-emerald-950/40 border border-emerald-900/40 flex items-center justify-center text-xs text-slate-500 shrink-0">
                          ◇
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                        <p className="text-[0.62rem] text-slate-500 truncate">{p.slug}</p>
                      </div>
                    </div>

                    <span className="text-[0.65rem] text-slate-400 whitespace-nowrap capitalize">
                      {p.category}
                    </span>

                    <span className="text-xs font-semibold text-white tabular-nums whitespace-nowrap">
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </span>

                    {/* Stock level badge */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.62rem] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                          0 left · Needs Restock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.62rem] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          {p.stock} left · Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.62rem] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {p.stock} in stock
                        </span>
                      )}
                    </div>

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
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-900/40 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-slate-400 transition-all hover:border-[#1fe0bb]/40 hover:text-[#1fe0bb] whitespace-nowrap"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
