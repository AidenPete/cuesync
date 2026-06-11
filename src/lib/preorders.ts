import type { PreorderRecord, PreorderRequest } from "@/lib/product-request-types";
import {
  deleteProductRequest,
  getProductRequests,
  saveProductRequest,
} from "@/lib/product-requests";

export async function savePreorder(request: PreorderRequest): Promise<PreorderRecord> {
  const record = await saveProductRequest({
    type: "preorder",
    source: "chat",
    productName: request.product,
    name: request.name,
    phone: request.phone,
    deliveryLocation: request.deliveryLocation,
    notes: request.notes,
  });

  return {
    id: record.id,
    createdAt: record.createdAt,
    name: record.name,
    phone: record.phone,
    product: record.productName,
    deliveryLocation: record.deliveryLocation ?? "",
    notes: record.notes,
  };
}

export async function getPreorders(): Promise<PreorderRecord[]> {
  const requests = await getProductRequests({ type: "preorder", source: "chat" });
  return requests.map((request) => ({
    id: request.id,
    createdAt: request.createdAt,
    name: request.name,
    phone: request.phone,
    product: request.productName,
    deliveryLocation: request.deliveryLocation ?? "",
    notes: request.notes,
  }));
}

export async function deletePreorder(id: string): Promise<boolean> {
  return deleteProductRequest(id);
}

export { getProductRequests, saveProductRequest, deleteProductRequest };
