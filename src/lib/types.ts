export type Category =
  | "cues"
  | "balls"
  | "chalk"
  | "gloves"
  | "cases"
  | "tables";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  accent: string;
  highlights: string[];
  featured?: boolean;
  /** Units available to sell. 0 = out of stock. */
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CheckoutRequest = {
  name: string;
  deliveryLocation: string;
  phone: string;
  items: { id: string; quantity: number }[];
};

export type { Order, OrderItem, OrderStatus, CheckoutResponse } from "@/lib/order-types";