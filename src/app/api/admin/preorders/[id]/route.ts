import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { deleteProductRequest } from "@/lib/product-requests";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const removed = await deleteProductRequest(id);
  if (!removed) {
    return NextResponse.json({ message: "Request not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
