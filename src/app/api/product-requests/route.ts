import { NextResponse } from "next/server";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";
import { isInStock } from "@/lib/inventory";
import { getProductById } from "@/lib/product-db";
import { saveProductRequest } from "@/lib/product-requests";
import type { ProductRequestType } from "@/lib/product-request-types";

export async function POST(request: Request) {
  const body = await request.json();

  const type = body.type === "wishlist" ? "wishlist" : "preorder";
  const source = body.source === "chat" ? "chat" : "shop";
  const name = String(body.name ?? "").trim();
  const phone = normalizePhone(String(body.phone ?? ""));
  const productId = String(body.productId ?? "").trim();
  const productName = String(body.productName ?? "").trim();
  const deliveryLocation = String(body.deliveryLocation ?? "").trim();
  const notes = body.notes ? String(body.notes).trim() : undefined;

  if (!name || !isValidKenyanPhone(phone)) {
    return NextResponse.json(
      { message: "Name and a valid phone number are required." },
      { status: 400 },
    );
  }

  if (!productId && !productName) {
    return NextResponse.json(
      { message: "Product information is required." },
      { status: 400 },
    );
  }

  if (type === "wishlist" && source === "shop") {
    return NextResponse.json(
      { message: "Wishlist is not available. Preorder this item instead." },
      { status: 400 },
    );
  }

  if (type === "preorder" && !deliveryLocation) {
    return NextResponse.json(
      { message: "Delivery location is required for preorders." },
      { status: 400 },
    );
  }

  let resolvedName = productName;
  if (productId) {
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }
    resolvedName = product.name;

    if (type === "preorder" && isInStock(product) && !product.preorderOnly) {
      return NextResponse.json(
        { message: "This item is in stock — add it to your cart instead." },
        { status: 400 },
      );
    }
  }

  const record = await saveProductRequest({
    type: type satisfies ProductRequestType,
    source,
    productId: productId || undefined,
    productName: resolvedName,
    name,
    phone,
    deliveryLocation: deliveryLocation || undefined,
    notes,
  });

  const message =
    type === "wishlist"
      ? "Added to your wishlist. We'll notify you when it's available."
      : "Preorder received. We'll contact you when this item is ready.";

  return NextResponse.json({ success: true, request: record, message }, { status: 201 });
}
