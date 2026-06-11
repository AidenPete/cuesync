import Link from "next/link";

type Props = {
  searchParams: Promise<{
    orderId?: string;
    name?: string;
    delivery?: string;
  }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderId, name, delivery } = await searchParams;

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 px-6 py-14">
        <p className="text-6xl">✅</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Payment received</h1>
        <p className="mt-3 text-emerald-100/80">
          Your M-Pesa payment was successful. We&apos;ll prepare your order for
          delivery.
        </p>

        {(orderId || name || delivery) && (
          <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-[#041912]/40 px-5 py-4 text-left text-sm">
            {orderId && (
              <p>
                <span className="text-emerald-200/60">Order</span>
                <span className="mt-0.5 block font-mono text-emerald-300">
                  #{orderId}
                </span>
              </p>
            )}
            {name && (
              <p>
                <span className="text-emerald-200/60">Name</span>
                <span className="mt-0.5 block font-medium text-white">
                  {name}
                </span>
              </p>
            )}
            {delivery && (
              <p>
                <span className="text-emerald-200/60">Delivery</span>
                <span className="mt-0.5 block font-medium text-white">
                  {delivery}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      <Link
        href="/shop"
        className="inline-flex rounded-full bg-emerald-500 px-6 py-3 font-semibold text-[#062318] transition hover:bg-emerald-400"
      >
        Continue shopping
      </Link>
    </div>
  );
}
