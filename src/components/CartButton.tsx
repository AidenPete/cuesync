"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

export function CartButton() {
  const { itemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#062318] transition hover:bg-emerald-400"
    >
      <span>Cart</span>
      {mounted && itemCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#062318] px-1.5 text-xs text-emerald-300">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
