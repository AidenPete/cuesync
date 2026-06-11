export type ProductRequestType = "preorder" | "wishlist";
export type ProductRequestSource = "shop" | "chat";

export type ProductRequestInput = {
  type: ProductRequestType;
  source?: ProductRequestSource;
  productId?: string;
  productName: string;
  name: string;
  phone: string;
  deliveryLocation?: string;
  notes?: string;
};

export type ProductRequest = ProductRequestInput & {
  id: string;
  source: ProductRequestSource;
  createdAt: string;
};

/** @deprecated Use ProductRequestInput */
export type PreorderRequest = {
  name: string;
  phone: string;
  product: string;
  deliveryLocation: string;
  notes?: string;
};

/** @deprecated Use ProductRequest */
export type PreorderRecord = PreorderRequest & {
  id: string;
  createdAt: string;
};
