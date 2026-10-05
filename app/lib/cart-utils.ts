import { jewelleryProducts, type JewelleryProduct } from "@/app/data/jewellery-products";

export type SelectedOptions = Record<string, string>;

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  selectedOptions: SelectedOptions;
}

export function normalizeSelectedOptions(value: unknown): SelectedOptions {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key, option]) =>
          key.trim().length > 0 &&
          typeof option === "string" &&
          option.trim().length > 0,
      )
      .map(([key, option]) => [key.trim(), (option as string).trim()])
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

export function getCartLineKey(line: Pick<CartLine, "productId" | "selectedOptions">): string {
  const options = Object.entries(normalizeSelectedOptions(line.selectedOptions));
  return JSON.stringify([line.productId, options]);
}

export function normalizeCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  const normalized = new Map<string, CartLine>();

  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;

    const candidate = entry as Record<string, unknown>;
    const product = jewelleryProducts.find(
      (item) =>
        item.id === candidate.productId ||
        (typeof candidate.slug === "string" && item.slug === candidate.slug),
    );
    if (!product || (product.stock !== undefined && product.stock <= 0)) continue;

    const requestedQuantity = Number(candidate.quantity);
    if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) continue;

    const quantity = Math.min(
      Math.floor(requestedQuantity),
      product.stock ?? Number.MAX_SAFE_INTEGER,
    );
    if (quantity < 1) continue;

    const line: CartLine = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      selectedOptions: normalizeSelectedOptions(candidate.selectedOptions),
    };
    const key = getCartLineKey(line);
    const existing = normalized.get(key);

    normalized.set(key, {
      ...line,
      quantity: Math.min(
        (existing?.quantity ?? 0) + line.quantity,
        product.stock ?? Number.MAX_SAFE_INTEGER,
      ),
    });
  }

  return Array.from(normalized.values());
}

export function getProductAmount(price: string): number {
  const amount = Number(price.replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLineAmount(line: CartLine): number {
  return getProductAmount(line.price) * line.quantity;
}

export function getCartSubtotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + getLineAmount(line), 0);
}

export function getCatalogProduct(productId: string): JewelleryProduct | undefined {
  return jewelleryProducts.find((product) => product.id === productId);
}
