import productsData from "@/data/products.json";
import type { Category, Product } from "@/lib/types";

export const products = productsData as Product[];

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cues", label: "Cues" },
  { id: "balls", label: "Balls" },
  { id: "chalk", label: "Chalk" },
  { id: "gloves", label: "Gloves" },
  { id: "cases", label: "Cases" },
  { id: "tables", label: "Table Care" },
];

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getProductsByCategory(category: Category | "all"): Product[] {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
}

export function getCategoryLabel(category: Category): string {
  const match = categories.find((entry) => entry.id === category);
  return match?.label ?? category;
}

export function getAllProductIds(): string[] {
  return products.map((product) => product.id);
}

export function slugifyProductId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
