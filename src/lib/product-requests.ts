import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  ProductRequest,
  ProductRequestInput,
  ProductRequestSource,
  ProductRequestType,
} from "@/lib/product-request-types";

const REQUESTS_PATH = path.join(process.cwd(), "data/product-requests.json");

let memoryRequests: ProductRequest[] | null = null;

function createRequestId() {
  return `PR${Date.now().toString(36).toUpperCase()}`;
}

function normalizeRecord(raw: Record<string, unknown>): ProductRequest {
  const type = raw.type === "wishlist" ? "wishlist" : "preorder";
  const source: ProductRequestSource =
    raw.source === "shop" ? "shop" : "chat";

  return {
    id: String(raw.id ?? createRequestId()),
    type,
    source,
    productId: raw.productId ? String(raw.productId) : undefined,
    productName: String(raw.productName ?? raw.product ?? "Unknown product"),
    name: String(raw.name ?? ""),
    phone: String(raw.phone ?? ""),
    deliveryLocation: raw.deliveryLocation
      ? String(raw.deliveryLocation)
      : undefined,
    notes: raw.notes ? String(raw.notes) : undefined,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}

async function readRequests(): Promise<ProductRequest[]> {
  if (memoryRequests) return memoryRequests;

  try {
    const raw = await fs.readFile(REQUESTS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    memoryRequests = parsed.map(normalizeRecord);
    return memoryRequests;
  } catch {
    memoryRequests = memoryRequests ?? [];
    return memoryRequests;
  }
}

async function writeRequests(requests: ProductRequest[]) {
  memoryRequests = requests;
  try {
    await fs.mkdir(path.dirname(REQUESTS_PATH), { recursive: true });
    await fs.writeFile(REQUESTS_PATH, JSON.stringify(requests, null, 2));
  } catch (error) {
    console.warn("[CueSync product-requests] Could not persist to disk:", error);
  }
}

export async function saveProductRequest(
  input: ProductRequestInput,
): Promise<ProductRequest> {
  const requests = await readRequests();
  const record: ProductRequest = {
    id: createRequestId(),
    createdAt: new Date().toISOString(),
    source: input.source ?? "shop",
    ...input,
  };

  requests.unshift(record);
  await writeRequests(requests);
  console.log("[CueSync product-request]", record);

  return record;
}

export async function getProductRequests(filters?: {
  type?: ProductRequestType;
  source?: ProductRequestSource;
}): Promise<ProductRequest[]> {
  const requests = await readRequests();
  return requests.filter((request) => {
    if (filters?.type && request.type !== filters.type) return false;
    if (filters?.source && request.source !== filters.source) return false;
    return true;
  });
}

export async function getProductRequestsByPhone(
  phone: string,
): Promise<ProductRequest[]> {
  const requests = await readRequests();
  return requests.filter((request) => request.phone === phone);
}

export async function deleteProductRequest(id: string): Promise<boolean> {
  const requests = await readRequests();
  const next = requests.filter((request) => request.id !== id);
  if (next.length === requests.length) return false;
  await writeRequests(next);
  return true;
}

export async function deleteProductRequestsByPhone(phone: string): Promise<number> {
  const requests = await readRequests();
  const next = requests.filter((request) => request.phone !== phone);
  const removed = requests.length - next.length;
  if (removed === 0) return 0;
  await writeRequests(next);
  return removed;
}

export async function countProductRequests(): Promise<{
  total: number;
  preorders: number;
  wishlists: number;
}> {
  const requests = await readRequests();
  return {
    total: requests.length,
    preorders: requests.filter((request) => request.type === "preorder").length,
    wishlists: requests.filter((request) => request.type === "wishlist").length,
  };
}
