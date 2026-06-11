export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type PreorderRequest = {
  name: string;
  phone: string;
  product: string;
  deliveryLocation: string;
  notes?: string;
};

export type PreorderRecord = PreorderRequest & {
  id: string;
  createdAt: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
};

export type ChatResponse = {
  message: string;
  preorderId?: string;
};
