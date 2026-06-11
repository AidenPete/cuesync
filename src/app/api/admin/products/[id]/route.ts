import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import {
  deleteProduct,
  getProductById,
  isValidCategory,
  saveProduct,
} from "@/lib/product-db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const body = await request.json();
  const name = String(body.name ?? existing.name).trim();
  const category = String(body.category ?? existing.category);
  const price = Number(body.price ?? existing.price);
  const description = String(body.description ?? existing.description).trim();
  const image = String(body.image ?? existing.image).trim();
  const accent = String(body.accent ?? existing.accent).trim();
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.map(String).filter(Boolean)
    : existing.highlights;
  const featured =
    body.featured !== undefined ? Boolean(body.featured) : existing.featured;
  const stock =
    body.stock !== undefined ? Math.max(0, Number(body.stock)) : existing.stock;

  if (!name || !isValidCategory(category) || !price || !description) {
    return NextResponse.json(
      { message: "Name, category, price, and description are required." },
      { status: 400 },
    );
  }

  const result = await saveProduct({
    id,
    name,
    category,
    price,
    description,
    image,
    accent,
    highlights,
    featured,
    stock,
  });

  return NextResponse.json({ product: result.product });
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const removed = await deleteProduct(id);
  if (!removed) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
