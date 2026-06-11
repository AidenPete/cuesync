export type CustomerRecord = {
  phone: string;
  name: string;
  deliveryLocation: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerInput = {
  phone: string;
  name: string;
  deliveryLocation?: string;
  notes?: string;
};
