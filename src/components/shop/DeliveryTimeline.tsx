import type { OrderStatus } from "@/lib/order-types";

const STEPS: { status: OrderStatus; label: string; detail: string }[] = [
  {
    status: "pending_delivery",
    label: "Preparing",
    detail: "We are getting your order ready.",
  },
  {
    status: "in_transit",
    label: "On transit",
    detail: "Your order is out for delivery.",
  },
  {
    status: "delivered",
    label: "Delivered",
    detail: "Order completed.",
  },
];

function stepIndex(status: OrderStatus) {
  if (status === "pending_delivery") return 0;
  if (status === "in_transit") return 1;
  return 2;
}

export function DeliveryTimeline({ status }: { status: OrderStatus }) {
  const active = stepIndex(status);

  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {STEPS.map((step, index) => {
        const done = index <= active;
        const current = index === active;

        return (
          <li
            key={step.status}
            className={`rounded-2xl border px-4 py-3 ${
              current
                ? "border-emerald-400/30 bg-emerald-400/10"
                : done
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-white/5 bg-white/[0.02] opacity-60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-emerald-400 text-[#062318]"
                    : "bg-white/10 text-emerald-100/50"
                }`}
              >
                {index + 1}
              </span>
              <p className={`font-medium ${done ? "text-white" : "text-emerald-100/50"}`}>
                {step.label}
              </p>
            </div>
            <p className="mt-2 text-xs text-emerald-100/60">{step.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}
