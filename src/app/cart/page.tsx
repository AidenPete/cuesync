import { CartSummary } from "@/components/CartSummary";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Your cart</h1>
        <p className="mt-2 text-emerald-100/70">
          Review your items before paying with M-Pesa.
        </p>
      </div>
      <CartSummary />
    </div>
  );
}
