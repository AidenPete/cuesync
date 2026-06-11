import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { getProductRequests } from "@/lib/product-requests";
import type { ProductRequestSource, ProductRequestType } from "@/lib/product-request-types";

export async function GET(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as ProductRequestType | null;
  const source = searchParams.get("source") as ProductRequestSource | null;

  const requests = await getProductRequests({
    type: type === "preorder" || type === "wishlist" ? type : undefined,
    source: source === "shop" || source === "chat" ? source : undefined,
  });

  return NextResponse.json({ requests });
}
