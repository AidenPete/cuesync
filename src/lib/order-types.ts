export type OrderStatus = "pending_delivery" | "in_transit" | "delivered";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  token: string;
  name: string;
  phone: string;
  deliveryLocation: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
  /** When the tracking link stops working (set after delivery). */
  accessExpiresAt?: string;
  /** Person assigned to deliver this order (admin record). */
  riderName?: string;
  riderPhone?: string;
};

export type CheckoutRequest = {
  name: string;
  deliveryLocation: string;
  phone: string;
  items: { id: string; quantity: number }[];
};

export type CheckoutResponse = {
  success: boolean;
  orderId: string;
  trackUrl: string;
  message: string;
  order: Order;
};

export type CustomerLookup = {
  name: string;
  deliveryLocation: string;
};
