import { NextResponse } from "next/server";
import { getProductById, decrementStock } from "@/lib/product-db";
import { saveOrder } from "@/lib/order-db";
import { isInStock } from "@/lib/inventory";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/order-types";
import { SITE_URL } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/ui";

function buildSmsMessage(name: string, trackUrl: string) {
  const firstName = name.split(" ")[0];
  return `Hi ${firstName}! Your CueSync order is confirmed. Track delivery & view receipt: ${trackUrl}`;
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

  const lineItems = (
    await Promise.all(
      body.items.map(async (item) => {
        const product = await getProductById(item.id);
        if (!product) return null;
        return { product, quantity: item.quantity };
      }),
    )
  ).filter(Boolean);

  if (lineItems.length === 0) {
    return NextResponse.json(
      { success: false, message: "No valid items in cart." },
      { status: 400 },
    );
  }

  for (const item of lineItems) {
    if (!isInStock(item!.product, item!.quantity)) {
      return NextResponse.json(
        {
          success: false,
          message: `${item!.product.name} only has ${item!.product.stock} left in stock.`,
        },
        { status: 400 },
      );
    }
  }

  const total = lineItems.reduce(
    (sum, item) => sum + item!.product.price * item!.quantity,
    0,
  );

  await new Promise((resolve) => setTimeout(resolve, 1800));

  const order = await saveOrder({
    name,
    phone: body.phone,
    deliveryLocation,
    items: lineItems.map((item) => ({
      productId: item!.product.id,
      name: item!.product.name,
      image: item!.product.image,
      price: item!.product.price,
      quantity: item!.quantity,
    })),
    total,
  });

  for (const item of lineItems) {
    const result = await decrementStock(item!.product.id, item!.quantity);
    if (!result.ok) {
      console.warn("[CueSync checkout] Stock decrement failed for", item!.product.id);
    }
  }

  const trackUrl = `${SITE_URL}/track/${order.token}`;
  const smsMessage = buildSmsMessage(name, trackUrl);

  console.log("[CueSync SMS mock]", {
    to: formatPhoneDisplay(body.phone),
    message: smsMessage,
  });

  const response: CheckoutResponse = {
    success: true,
    orderId: order.id,
    trackUrl,
    message: `Mock SMS sent to ${formatPhoneDisplay(body.phone)}.`,
    order,
  };

  return NextResponse.json(response);
}
