"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  active: boolean;
};

type Product = ProductFormData & { id: string };

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    price: product?.price ?? "",
    stock: product?.stock ?? "0",
    active: product?.active ?? true,
  });

  const isEditing = !!product?.id;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const url = isEditing
          ? `/api/admin/products/${product.id}`
          : `/api/admin/products`;

        const res = await fetch(url, {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to save product.");
          return;
        }

        router.push("/admin/products");
        router.refresh();
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  const inputClass =
    "w-full rounded-xl border border-emerald-900/50 bg-[#010d08] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-[#1fe0bb]/50 focus:outline-none focus:ring-1 focus:ring-[#1fe0bb]/30 transition-all";
  const labelClass =
    "block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="pf-name">
            Product Name
          </label>
          <input
            id="pf-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Crescent Moon Ring"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="pf-slug">
            Slug (URL key)
          </label>
          <input
            id="pf-slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="e.g. crescent-moon-ring"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="pf-category">
            Category
          </label>
          <select
            id="pf-category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Select…</option>
            <option value="rings">Rings</option>
            <option value="bracelets">Bracelets</option>
            <option value="studs">Studs</option>
            <option value="pendants">Pendants</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="pf-price">
            Price (₹)
          </label>
          <input
            id="pf-price"
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="2499.00"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="pf-stock">
            Stock Quantity
          </label>
          <input
            id="pf-stock"
            type="number"
            name="stock"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="pf-description">
            Description
          </label>
          <textarea
            id="pf-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the product…"
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-3">
          <input
            id="pf-active"
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-emerald-800 bg-[#010d08] accent-[#1fe0bb]"
          />
          <label
            htmlFor="pf-active"
            className="text-sm text-slate-300 cursor-pointer"
          >
            Product is active (visible in the store)
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[#1fe0bb] px-6 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-lg shadow-[#1fe0bb]/20 disabled:opacity-60"
        >
          {isPending ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
        </button>
        <a
          href="/admin/products"
          className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-slate-500 hover:text-slate-300 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
