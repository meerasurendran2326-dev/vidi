"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Image as ImageIcon } from "lucide-react";

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  active: boolean;
  images: string[];
};

type Product = ProductFormData & { id: string };

interface ProductFormProps {
  product?: Partial<ProductFormData> & { id?: string };
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
    images: product?.images ?? [],
  });

  const [imageUrlInput, setImageUrlInput] = useState("");

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

  const handleAddImage = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (form.images.includes(trimmed)) {
      setImageUrlInput("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
    }));
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
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
            images: form.images,
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
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Vici Obsidian Signet Ring"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="pf-slug">
            URL Slug
          </label>
          <input
            id="pf-slug"
            type="text"
            name="slug"
            required
            value={form.slug}
            onChange={handleChange}
            placeholder="e.g. vici-obsidian-signet-ring"
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
            required
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a category</option>
            <option value="rings">Rings</option>
            <option value="bracelet">Bracelet</option>
            <option value="pendent-set">Pendent Set</option>
            <option value="stud">Stud</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="pf-price">
            Price (INR ₹)
          </label>
          <input
            id="pf-price"
            type="number"
            name="price"
            min="1"
            step="0.01"
            required
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 14200"
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
            required
            value={form.stock}
            onChange={handleChange}
            placeholder="e.g. 10"
            className={inputClass}
          />
        </div>

        {/* Product Images Section */}
        <div className="sm:col-span-2 border-t border-emerald-900/40 pt-4">
          <label className={labelClass}>
            Product Images (URLs or Atelier Paths)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Add high-resolution image URLs or local image assets (e.g. <code>/images/custom/img1.jpeg</code> or <code>https://...</code>).
          </p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Enter image URL or path e.g. /images/custom/img1.jpeg"
              className={inputClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-[#1fe0bb] hover:text-[#03251c] transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
            <span className="text-[0.6rem] uppercase tracking-wider text-slate-500 font-semibold mr-1">
              Quick Atelier Presets:
            </span>
            {["/images/custom/img1.jpeg", "/images/custom/img2.jpeg", "/images/custom/img3.jpeg", "/images/custom/img4.jpeg", "/images/custom/img5.jpeg"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  if (!form.images.includes(preset)) {
                    setForm((p) => ({ ...p, images: [...p.images, preset] }));
                  }
                }}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 hover:text-[#1fe0bb] hover:border-[#1fe0bb]/40 text-[0.62rem]"
              >
                + {preset.split("/").pop()}
              </button>
            ))}
          </div>

          {/* Image Previews */}
          {form.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.images.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className="relative group rounded-xl overflow-hidden border border-emerald-900/50 bg-black/40 aspect-square"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Product preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[0.55rem] font-bold text-white">
                    {idx === 0 ? "Primary" : `#${idx + 1}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-900/80 text-rose-200 hover:bg-rose-600 transition-colors shadow"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-emerald-900/60 rounded-xl p-6 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-1.5">
              <ImageIcon className="w-6 h-6 text-slate-600" />
              <span>No images added yet. Add at least one image URL above.</span>
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="pf-desc">
            Description
          </label>
          <textarea
            id="pf-desc"
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
