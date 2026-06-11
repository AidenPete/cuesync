"use client";

import { getAvailability, getStockLabel } from "@/lib/inventory";

type Props = {
  stock: number;
  preorderOnly?: boolean;
  className?: string;
};

export function StockBadge({ stock, preorderOnly = false, className = "" }: Props) {
  const availability = getAvailability({ stock, preorderOnly });
  const label = getStockLabel({ stock, preorderOnly });

  const styles = {
    in_stock: "bg-emerald-500/20 text-emerald-200",
    low_stock: "bg-amber-400/20 text-amber-200",
    out_of_stock: "bg-red-500/20 text-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[availability]} ${className}`}
    >
      {label}
    </span>
  );
}
