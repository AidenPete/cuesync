import { promises as fs } from "node:fs";
import path from "node:path";
import seedProducts from "@/data/products.json";
import type { Category, Product } from "@/lib/types";
import { normalizeProduct } from "@/lib/inventory";
import { slugifyProductId } from "@/lib/products";

const PRODUCTS_PATH = path.join(process.cwd(), "data/products.json");

let memoryProducts: Product[] | null = null;

async function readProducts(): Promise<Product[]> {
  if (memoryProducts) return memoryProducts;

  try {
    const raw = await fs.readFile(PRODUCTS_PATH, "utf8");
    memoryProducts = (JSON.parse(raw) as Product[]).map(normalizeProduct);
    return memoryProducts;
  } catch {
    memoryProducts = [...(seedProducts as Product[])].map(normalizeProduct);
    await writeProducts(memoryProducts);
    return memoryProducts;
  }
}

async function writeProducts(products: Product[]) {
  memoryProducts = products;
  try {
    await fs.mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2));
  } catch (error) {
    console.warn("[CueSync products] Could not persist to disk:", error);
  }
}

export async function listProducts(): Promise<Product[]> {
  return readProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((product) => product.id === id);
}

export async function saveProduct(
  product: Product,
): Promise<{ product?: Product; error?: string }> {
  const products = await readProducts();
  const index = products.findIndex((entry) => entry.id === product.id);

  const normalized = normalizeProduct(product);

  if (index >= 0) {
    products[index] = normalized;
  } else {
    if (products.some((entry) => entry.id === product.id)) {
      return { error: "Product ID already exists." };
    }
    products.push(normalized);
  }

  await writeProducts(products);
  return { product: normalized };
}

export async function createProduct(
  product: Product,
): Promise<{ product?: Product; error?: string }> {
  const products = await readProducts();
  if (products.some((entry) => entry.id === product.id)) {
    return { error: "Product ID already exists." };
  }
  const normalized = normalizeProduct(product);
  products.push(normalized);
  await writeProducts(products);
  return { product: normalized };
}

export async function decrementStock(
  id: string,
  quantity: number,
): Promise<{ ok: boolean; product?: Product }> {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index < 0) return { ok: false };

  const product = products[index];
  if (product.stock < quantity) return { ok: false, product };

  products[index] = normalizeProduct({
    ...product,
    stock: product.stock - quantity,
  });
  await writeProducts(products);
  return { ok: true, product: products[index] };
}

export async function setProductStock(
  id: string,
  stock: number,
): Promise<Product | undefined> {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index < 0) return undefined;

  products[index] = normalizeProduct({
    ...products[index],
    stock,
  });
  await writeProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readProducts();
  const next = products.filter((product) => product.id !== id);
  if (next.length === products.length) return false;
  await writeProducts(next);
  return true;
}

export function slugifyId(name: string): string {
  return slugifyProductId(name);
}

export function isValidCategory(value: string): value is Category {
  return ["cues", "balls", "chalk", "gloves", "cases", "tables"].includes(value);
}
