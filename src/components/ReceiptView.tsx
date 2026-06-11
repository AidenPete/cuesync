import { formatKes } from "@/lib/format";
import { formatOrderDate, statusLabel } from "@/lib/orders";
import { ProductImage } from "@/components/ProductImage";
import { SITE_NAME } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/ui";
import type { Order } from "@/lib/order-types";

type Props = {
  order: Order;
  showSuccess?: boolean;
};

export function ReceiptView({ order, showSuccess = false }: Props) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      {showSuccess && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-center">
          <p className="text-3xl">✅</p>
          <p className="mt-2 font-semibold text-white">Payment received</p>
          <p className="mt-1 text-sm text-emerald-100/70">
            Your receipt is saved below.
          </p>
        </div>
      )}

      <article
        id="receipt"
        className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
      >
        <div className="border-b border-white/10 bg-[#0b4a33]/40 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-200/70">Receipt</p>
              <h1 className="text-2xl font-bold text-white">{SITE_NAME}</h1>
              <p className="mt-1 font-mono text-sm text-emerald-300">
                #{order.id}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                order.status === "delivered"
                  ? "bg-emerald-400/20 text-emerald-200"
                  : order.status === "in_transit"
                    ? "bg-sky-400/20 text-sky-200"
                    : "bg-amber-400/20 text-amber-200"
              }`}
            >
              {statusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-emerald-200/60">Date</p>
              <p className="font-medium text-white">
                {formatOrderDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-emerald-200/60">Payment</p>
              <p className="font-medium text-white">M-Pesa</p>
            </div>
            <div>
              <p className="text-emerald-200/60">Customer</p>
              <p className="font-medium text-white">{order.name}</p>
            </div>
            <div>
              <p className="text-emerald-200/60">Phone</p>
              <p className="font-medium text-white">
                {formatPhoneDisplay(order.phone)}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-emerald-200/60">Delivery location</p>
              <p className="font-medium text-white">{order.deliveryLocation}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 font-medium text-emerald-100">Items</p>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-3 text-emerald-100/90">
                    <ProductImage
                      product={{ name: item.name, image: item.image }}
                      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg"
                      imageClassName="object-cover"
                      sizes="40px"
                    />
                    <span>
                      {item.name}
                      <span className="block text-xs text-emerald-200/50">
                        × {item.quantity}
                      </span>
                    </span>
                  </span>
                  <span className="font-medium text-white">
                    {formatKes(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-lg font-bold">
            <span className="text-emerald-100">Total paid</span>
            <span className="text-emerald-300">{formatKes(order.total)}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
