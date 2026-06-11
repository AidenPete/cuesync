import type { PreorderRecord, PreorderRequest } from "@/lib/chat-types";

const preorders: PreorderRecord[] = [];

function createPreorderId() {
  return `PO${Date.now().toString(36).toUpperCase()}`;
}

export function savePreorder(request: PreorderRequest): PreorderRecord {
  const record: PreorderRecord = {
    id: createPreorderId(),
    createdAt: new Date().toISOString(),
    ...request,
  };

  preorders.push(record);
  console.log("[CueSync preorder]", record);

  return record;
}

export function getPreorders(): PreorderRecord[] {
  return [...preorders];
}
