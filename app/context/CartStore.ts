"use client";

import { useSyncExternalStore } from "react";
import type { JewelleryProduct } from "@/app/data/jewellery-products";
import {
  getCartLineKey,
  getCatalogProduct,
  normalizeCart,
  normalizeSelectedOptions,
  type CartLine,
  type SelectedOptions,
} from "@/app/lib/cart-utils";

export type { CartLine, SelectedOptions } from "@/app/lib/cart-utils";

const STORAGE_KEY = "vici_cart_items_v1";
const EMPTY_CART: CartLine[] = [];
let cartSnapshot = EMPTY_CART;
let isLoaded = false;
const listeners = new Set<() => void>();

function readCart(): CartLine[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    const normalized = normalizeCart(parsed);
    const serialized = JSON.stringify(normalized);
    if (saved !== serialized) localStorage.setItem(STORAGE_KEY, serialized);
    return normalized;
  } catch {
    return [];
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function syncCartFromStorage() {
  cartSnapshot = readCart();
  isLoaded = true;
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!isLoaded) syncCartFromStorage();
  window.addEventListener("storage", syncCartFromStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", syncCartFromStorage);
  };
}

function getSnapshot() {
  return cartSnapshot;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function commitCart(nextCart: CartLine[]) {
  cartSnapshot = nextCart;
  isLoaded = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCart));
  } catch {
    // Keep the in-memory cart usable for this session if storage is unavailable.
  }
  notify();
}

export function addProductToCart(
  product: JewelleryProduct,
  quantity: number,
  selectedOptions: SelectedOptions = {},
): boolean {
  if (product.stock !== undefined && product.stock <= 0) return false;

  if (!isLoaded) {
    cartSnapshot = readCart();
    isLoaded = true;
  }

  const safeQuantity = Math.max(1, Math.floor(quantity));
  const line: CartLine = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: safeQuantity,
    selectedOptions: normalizeSelectedOptions(selectedOptions),
  };
  commitCart(normalizeCart([...cartSnapshot, line]));
  return true;
}

export function removeCartItem(lineKey: string) {
  commitCart(cartSnapshot.filter((line) => getCartLineKey(line) !== lineKey));
}

export function setCartItemQuantity(lineKey: string, quantity: number) {
  if (quantity <= 0) {
    removeCartItem(lineKey);
    return;
  }

  commitCart(
    normalizeCart(
      cartSnapshot.map((line) => {
        if (getCartLineKey(line) !== lineKey) return line;
        const product = getCatalogProduct(line.productId);
        const safeQuantity = Math.floor(quantity);
        return {
          ...line,
          quantity:
            product?.stock === undefined
              ? safeQuantity
              : Math.min(safeQuantity, product.stock),
        };
      }),
    ),
  );
}

export function clearCart() {
  commitCart([]);
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const itemCount = items.reduce((total, line) => total + line.quantity, 0);

  return { items, itemCount };
}