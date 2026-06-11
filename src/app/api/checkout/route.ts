import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/types";

function createOrderId() {
  return `CS${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutRequest;

  const name = body.name?.trim();
  const deliveryLocation = body.deliveryLocation?.trim();

  if (!name || !deliveryLocation || !body.phone || !body.items?.length) {
    return NextResponse.json(
      {
        success: false,
        message: "Name, delivery location, phone, and items are required.",
      },
      { status: 400 },
    );
  }

  const lineItems = body.items
    .map((item) => {
      const product = getProduct(item.id);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter(Boolean);

  if (lineItems.length === 0) {
    return NextResponse.json(
      { success: false, message: "No valid items in cart." },
      { status: 400 },
    );
  }

  const total = lineItems.reduce(
    (sum, item) => sum + item!.product.price * item!.quantity,
    0,
  );

  // Simulate Daraja STK push delay
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const response: CheckoutResponse = {
    success: true,
    orderId: createOrderId(),
    message: `Mock M-Pesa STK push sent to ${body.phone} for KES ${total}.`,
  };

  console.log("[CueSync mock checkout]", {
    orderId: response.orderId,
    name,
    deliveryLocation,
    phone: body.phone,
    total,
    items: lineItems.map((item) => ({
      id: item!.product.id,
      qty: item!.quantity,
    })),
  });

  return NextResponse.json(response);
}
