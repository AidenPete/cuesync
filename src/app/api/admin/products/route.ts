import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";
import { listProducts } from "@/lib/product-db";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const { createProduct, isValidCategory, slugifyId } = await import(
    "@/lib/product-db"
  );

  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "");
  const price = Number(body.price);
  const description = String(body.description ?? "").trim();
  const image = String(body.image ?? "").trim();
  const accent = String(body.accent ?? "#1a6b4a").trim();
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.map(String).filter(Boolean)
    : [];
  const featured = Boolean(body.featured);
  const stock = Number(body.stock ?? 10);
  const preorderOnly = Boolean(body.preorderOnly);
  const id = String(body.id ?? slugifyId(name)).trim();

  if (!name || !isValidCategory(category) || !price || !description) {
    return NextResponse.json(
      { message: "Name, category, price, and description are required." },
      { status: 400 },
    );
  }

  const result = await createProduct({
    id,
    name,
    category,
    price,
    description,
    image: image || `/products/${id}.jpg`,
    accent,
    highlights,
    featured,
    stock: Number.isFinite(stock) ? Math.max(0, stock) : 10,
    preorderOnly,
  });

  if (result.error) {
    return NextResponse.json({ message: result.error }, { status: 409 });
  }

  return NextResponse.json({ product: result.product }, { status: 201 });
}
