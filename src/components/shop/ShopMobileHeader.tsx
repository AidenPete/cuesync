"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { ShopLogo, ShopNavIcon } from "@/components/shop/ShopNavIcons";
import { SITE_NAME } from "@/lib/site";

type Props = {
  onMenuOpen: () => void;
};

export function ShopMobileHeader({ onMenuOpen }: Props) {
  const { itemCount } = useCart();
  const { phone, loading } = usePhoneAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-[#062318]/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <Link href="/shop" className="flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-white">
            <ShopLogo className="h-4 w-4" />
          </span>
          <span className="truncate font-bold text-white">{SITE_NAME}</span>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {mounted && !loading && !phone && (
          <Link
            href="/login"
            className="rounded-full border border-emerald-400/40 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
          >
            Sign in
          </Link>
        )}
        {mounted && !loading && phone && (
          <Link
            href="/orders"
            aria-label="My account"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-100/80 transition hover:bg-white/10 hover:text-white"
          >
            <ShopNavIcon name="account" className="h-5 w-5" />
          </Link>
        )}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#062318] transition hover:bg-emerald-400"
        >
          Cart
          {itemCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#062318] px-1.5 text-xs text-emerald-300">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
