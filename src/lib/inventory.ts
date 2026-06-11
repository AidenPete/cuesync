import type { Product } from "@/lib/types";

export const LOW_STOCK_THRESHOLD = 5;

export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export function normalizeStock(stock: number | undefined): number {
  if (typeof stock !== "number" || Number.isNaN(stock)) return 10;
  return Math.max(0, Math.floor(stock));
}

export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    stock: normalizeStock(product.stock),
    preorderOnly: Boolean(product.preorderOnly),
  };
}

export function canAddToCart(
  product: Pick<Product, "stock" | "preorderOnly">,
  currentInCart = 0,
): boolean {
  if (product.preorderOnly) return false;
  return maxAddQuantity(product, currentInCart) > 0;
}

export function showPreorder(product: Pick<Product, "stock" | "preorderOnly">): boolean {
  if (product.preorderOnly) return true;
  return !isInStock(product);
}

export function getAvailability(
  product: Pick<Product, "stock" | "preorderOnly">,
): Availability {
  if (product.preorderOnly) return "out_of_stock";
  const stock = normalizeStock(product.stock);
  if (stock <= 0) return "out_of_stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export function isInStock(product: Pick<Product, "stock">, quantity = 1): boolean {
  return normalizeStock(product.stock) >= quantity;
}

export function getStockLabel(product: Pick<Product, "stock" | "preorderOnly">): string {
  if (product.preorderOnly) return "Preorder only";
  const stock = normalizeStock(product.stock);
  if (stock <= 0) return "Preorder only";
  if (stock <= LOW_STOCK_THRESHOLD) return `${stock} left`;
  return "In stock";
}

export function maxAddQuantity(
  product: Pick<Product, "stock">,
  currentInCart = 0,
): number {
  return Math.max(0, normalizeStock(product.stock) - currentInCart);
}
