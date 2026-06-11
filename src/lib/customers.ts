import {
  deleteCustomerRecord,
  getCustomerRecord,
  listCustomerRecords,
  saveCustomerRecord,
  updateCustomerRecord,
  upsertCustomerRecord,
} from "@/lib/customer-db";
import type { CustomerInput, CustomerRecord } from "@/lib/customer-types";
import { normalizePhone } from "@/lib/format";
import { findOrdersByPhone, listOrders } from "@/lib/order-db";
import {
  deleteProductRequestsByPhone,
  getProductRequests,
  getProductRequestsByPhone,
} from "@/lib/product-requests";
import type { ProductRequest } from "@/lib/product-request-types";

export type CustomerSummary = {
  phone: string;
  name: string;
  deliveryLocation: string;
  notes?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  pendingCount: number;
  wishlistCount: number;
  preorderCount: number;
  lastActivityAt: string;
  isStored: boolean;
};

function latestTimestamp(...values: string[]) {
  return values.reduce((latest, value) => {
    if (!value) return latest;
    if (!latest || value > latest) return value;
    return latest;
  }, "");
}

function createEmptySummary(stored: CustomerRecord): CustomerSummary {
  return {
    phone: stored.phone,
    name: stored.name,
    deliveryLocation: stored.deliveryLocation,
    notes: stored.notes,
    orderCount: 0,
    totalSpent: 0,
    lastOrderAt: "",
    pendingCount: 0,
    wishlistCount: 0,
    preorderCount: 0,
    lastActivityAt: stored.updatedAt,
    isStored: true,
  };
}

function applyRequestToSummary(
  summary: CustomerSummary,
  request: ProductRequest,
) {
  if (request.type === "wishlist") {
    summary.wishlistCount += 1;
  } else {
    summary.preorderCount += 1;
  }

  summary.lastActivityAt = latestTimestamp(
    summary.lastActivityAt,
    request.createdAt,
  );

  if (!summary.lastOrderAt || request.createdAt > summary.lastOrderAt) {
    if (!summary.isStored) {
      summary.name = request.name || summary.name;
      if (request.deliveryLocation) {
        summary.deliveryLocation = request.deliveryLocation;
      }
    }
  }
}

function resolveProfile(
  stored: CustomerRecord | undefined,
  latestOrder: Awaited<ReturnType<typeof findOrdersByPhone>>[number] | undefined,
  latestRequest: ProductRequest | undefined,
) {
  if (stored) {
    return {
      name: stored.name,
      deliveryLocation: stored.deliveryLocation,
      notes: stored.notes,
      isStored: true,
    };
  }

  const useOrderProfile =
    latestOrder &&
    (!latestRequest || latestOrder.createdAt >= latestRequest.createdAt);

  return {
    name: useOrderProfile ? latestOrder.name : latestRequest?.name ?? "",
    deliveryLocation: useOrderProfile
      ? latestOrder.deliveryLocation
      : latestRequest?.deliveryLocation ?? "",
    notes: undefined,
    isStored: false,
  };
}

export async function listCustomers(): Promise<CustomerSummary[]> {
  const [orders, requests, storedCustomers] = await Promise.all([
    listOrders(),
    getProductRequests(),
    listCustomerRecords(),
  ]);
  const map = new Map<string, CustomerSummary>();

  for (const stored of storedCustomers) {
    map.set(stored.phone, createEmptySummary(stored));
  }

  for (const order of orders) {
    const existing = map.get(order.phone);
    if (!existing) {
      map.set(order.phone, {
        phone: order.phone,
        name: order.name,
        deliveryLocation: order.deliveryLocation,
        orderCount: 1,
        totalSpent: order.total,
        lastOrderAt: order.createdAt,
        pendingCount: order.status === "pending_delivery" ? 1 : 0,
        wishlistCount: 0,
        preorderCount: 0,
        lastActivityAt: order.createdAt,
        isStored: false,
      });
      continue;
    }

    existing.orderCount += 1;
    existing.totalSpent += order.total;
    if (order.createdAt > existing.lastOrderAt) {
      existing.lastOrderAt = order.createdAt;
      if (!existing.isStored) {
        existing.name = order.name;
        existing.deliveryLocation = order.deliveryLocation;
      }
    }
    if (order.status === "pending_delivery") {
      existing.pendingCount += 1;
    }
    existing.lastActivityAt = latestTimestamp(
      existing.lastActivityAt,
      order.createdAt,
    );
  }

  for (const request of requests) {
    const existing = map.get(request.phone);
    if (!existing) {
      map.set(request.phone, {
        phone: request.phone,
        name: request.name,
        deliveryLocation: request.deliveryLocation ?? "",
        orderCount: 0,
        totalSpent: 0,
        lastOrderAt: "",
        pendingCount: 0,
        wishlistCount: request.type === "wishlist" ? 1 : 0,
        preorderCount: request.type === "preorder" ? 1 : 0,
        lastActivityAt: request.createdAt,
        isStored: false,
      });
      continue;
    }

    applyRequestToSummary(existing, request);
  }

  return [...map.values()].sort(
    (a, b) =>
      new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime(),
  );
}

export async function getCustomerDetail(phone: string) {
  const normalizedPhone = normalizePhone(decodeURIComponent(phone));
  const [orders, requests, stored] = await Promise.all([
    findOrdersByPhone(normalizedPhone),
    getProductRequestsByPhone(normalizedPhone),
    getCustomerRecord(normalizedPhone),
  ]);

  if (orders.length === 0 && requests.length === 0 && !stored) return null;

  const wishlists = requests.filter((request) => request.type === "wishlist");
  const preorders = requests.filter((request) => request.type === "preorder");
  const profile = resolveProfile(stored, orders[0], requests[0]);

  return {
    phone: normalizedPhone,
    name: profile.name,
    deliveryLocation: profile.deliveryLocation,
    notes: profile.notes,
    isStored: profile.isStored,
    orders,
    wishlists,
    preorders,
    orderCount: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    wishlistCount: wishlists.length,
    preorderCount: preorders.length,
  };
}

export async function createCustomer(input: CustomerInput) {
  return saveCustomerRecord(input);
}

export async function updateCustomer(
  phone: string,
  updates: Partial<Omit<CustomerInput, "phone">>,
) {
  const normalizedPhone = normalizePhone(phone);
  const stored = await getCustomerRecord(normalizedPhone);

  if (stored) {
    return updateCustomerRecord(normalizedPhone, updates);
  }

  const detail = await getCustomerDetail(normalizedPhone);
  if (!detail) return { error: "Customer not found." };

  return saveCustomerRecord({
    phone: normalizedPhone,
    name: updates.name ?? detail.name,
    deliveryLocation: updates.deliveryLocation ?? detail.deliveryLocation,
    notes: updates.notes ?? detail.notes,
  });
}

export async function lookupCustomerProfile(phone: string) {
  const normalized = normalizePhone(phone);
  const stored = await getCustomerRecord(normalized);
  if (stored) {
    return {
      name: stored.name,
      deliveryLocation: stored.deliveryLocation,
    };
  }

  const orders = await findOrdersByPhone(normalized);
  const latest = orders[0];
  if (!latest) return null;

  return {
    name: latest.name,
    deliveryLocation: latest.deliveryLocation,
  };
}

export async function removeCustomer(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const orders = await findOrdersByPhone(normalizedPhone);

  if (orders.length > 0) {
    return {
      error: "Cannot delete a customer who has orders on file.",
    };
  }

  const removedRequests = await deleteProductRequestsByPhone(normalizedPhone);
  const removedProfile = await deleteCustomerRecord(normalizedPhone);

  if (!removedProfile && removedRequests === 0) {
    return { error: "Customer not found." };
  }

  return { success: true, removedRequests };
}

export { upsertCustomerRecord };
