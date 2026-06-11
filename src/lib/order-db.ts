import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { CustomerLookup, Order, OrderStatus } from "@/lib/order-types";
import { sortOrdersNewestFirst } from "@/lib/orders";

const ORDERS_PATH = path.join(process.cwd(), "data/orders.json");
const ACCESS_GRACE_DAYS = 7;

let memoryOrders: Order[] | null = null;

async function readOrders(): Promise<Order[]> {
  if (memoryOrders) return memoryOrders;
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf8");
    memoryOrders = JSON.parse(raw) as Order[];
    return memoryOrders;
  } catch {
    memoryOrders = memoryOrders ?? [];
    return memoryOrders;
  }
}

async function writeOrders(orders: Order[]) {
  memoryOrders = orders;
  try {
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.warn("[CueSync orders] Could not persist to disk:", error);
  }
}

function createOrderId() {
  return `CS${Date.now().toString(36).toUpperCase()}`;
}

function createTrackToken() {
  return randomBytes(24).toString("base64url");
}

export function isTrackLinkValid(order: Order): boolean {
  if (order.status === "pending_delivery" || order.status === "in_transit") {
    return true;
  }
  if (!order.accessExpiresAt) return false;
  return new Date(order.accessExpiresAt) > new Date();
}

export async function saveOrder(
  order: Omit<Order, "id" | "token" | "status" | "createdAt">,
): Promise<Order> {
  const orders = await readOrders();
  const record: Order = {
    id: createOrderId(),
    token: createTrackToken(),
    status: "pending_delivery",
    createdAt: new Date().toISOString(),
    ...order,
  };
  orders.unshift(record);
  await writeOrders(orders);
  return record;
}

export async function findOrderByToken(token: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((order) => order.token === token);
}

export async function findLatestByPhone(phone: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((order) => order.phone === phone);
}

export async function findOrdersByPhone(phone: string): Promise<Order[]> {
  const orders = await readOrders();
  return sortOrdersNewestFirst(orders.filter((order) => order.phone === phone));
}

export async function listOrders(filters?: {
  status?: OrderStatus;
}): Promise<Order[]> {
  const orders = sortOrdersNewestFirst(await readOrders());
  if (!filters?.status) return orders;
  return orders.filter((order) => order.status === filters.status);
}

export async function findOrderById(id: string): Promise<Order | undefined> {
  const orders = await readOrders();
  return orders.find((order) => order.id === id);
}

export async function lookupCustomer(phone: string): Promise<CustomerLookup | null> {
  const order = await findLatestByPhone(phone);
  if (!order) return null;
  return { name: order.name, deliveryLocation: order.deliveryLocation };
}

export async function markOrderDelivered(token: string): Promise<Order | undefined> {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.token === token);
  if (index < 0) return undefined;
  return markOrderDeliveredAtIndex(orders, index);
}

export async function markOrderDeliveredById(id: string): Promise<Order | undefined> {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) return undefined;
  return markOrderDeliveredAtIndex(orders, index);
}

export async function updateOrder(
  id: string,
  updates: Partial<
    Pick<
      Order,
      "name" | "phone" | "deliveryLocation" | "status" | "riderName" | "riderPhone"
    >
  >,
): Promise<Order | undefined> {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) return undefined;

  const current = orders[index];
  let next: Order = { ...current, ...updates };

  if (updates.status === "delivered" && current.status !== "delivered") {
    const deliveredAt = new Date();
    const accessExpiresAt = new Date(deliveredAt);
    accessExpiresAt.setDate(accessExpiresAt.getDate() + ACCESS_GRACE_DAYS);
    next = {
      ...next,
      deliveredAt: deliveredAt.toISOString(),
      accessExpiresAt: accessExpiresAt.toISOString(),
    };
  }

  if (updates.status === "pending_delivery" && current.status === "delivered") {
    next = {
      ...next,
      deliveredAt: undefined,
      accessExpiresAt: undefined,
    };
  }

  if (updates.status === "in_transit" && current.status === "delivered") {
    next = {
      ...next,
      deliveredAt: undefined,
      accessExpiresAt: undefined,
    };
  }

  orders[index] = next;
  await writeOrders(orders);
  return next;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const orders = await readOrders();
  const next = orders.filter((order) => order.id !== id);
  if (next.length === orders.length) return false;
  await writeOrders(next);
  return true;
}

async function markOrderDeliveredAtIndex(
  orders: Order[],
  index: number,
): Promise<Order> {
  const deliveredAt = new Date();
  const accessExpiresAt = new Date(deliveredAt);
  accessExpiresAt.setDate(accessExpiresAt.getDate() + ACCESS_GRACE_DAYS);

  orders[index] = {
    ...orders[index],
    status: "delivered" satisfies OrderStatus,
    deliveredAt: deliveredAt.toISOString(),
    accessExpiresAt: accessExpiresAt.toISOString(),
  };

  await writeOrders(orders);
  return orders[index];
}
