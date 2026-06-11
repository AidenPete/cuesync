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
  featured?: boolean;
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

export type CheckoutResponse = {
  success: boolean;
  orderId: string;
  message: string;
};