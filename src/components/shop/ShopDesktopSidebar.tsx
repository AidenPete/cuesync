"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import {
  ShopLogo,
  ShopNavIcon,
  type ShopNavIconName,
} from "@/components/shop/ShopNavIcons";
import { SITE_NAME } from "@/lib/site";
import { formatPhoneDisplay } from "@/lib/ui";

type NavItem = {
  href: string;
  label: string;
  icon: ShopNavIconName;
  exact?: boolean;
  badge?: number;
};

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-400/20"
          : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={active ? "text-emerald-300" : "text-emerald-100/50"}>
        <ShopNavIcon name={item.icon} />
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-xs font-bold text-[#062318]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function ShopDesktopSidebar() {
  const { itemCount } = useCart();
  const { phone, loading, logout } = usePhoneAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: "home", exact: true },
    { href: "/shop", label: "Catalogue", icon: "shop" },
    {
      href: "/cart",
      label: "Cart",
      icon: "cart",
      badge: mounted ? itemCount : 0,
    },
    { href: "/orders", label: "My orders", icon: "orders" },
    { href: "/qr", label: "Share QR", icon: "qr" },
  ];

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-[#062318]/98 backdrop-blur-md md:flex md:max-h-dvh md:overflow-y-auto">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/shop" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-white shadow-lg shadow-emerald-900/40">
            <ShopLogo className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">{SITE_NAME}</p>
            <p className="text-xs text-emerald-200/70">Pool & Billiard Gear</p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        {!loading && phone ? (
          <>
            <p className="px-4 py-2 text-xs text-emerald-100/50">
              Signed in as {formatPhoneDisplay(phone)}
            </p>
            <button
              type="button"
              onClick={() => logout()}
              className="w-full rounded-2xl px-4 py-2.5 text-left text-sm text-emerald-100/60 transition hover:bg-white/5 hover:text-white"
            >
              Sign out
            </button>
          </>
        ) : (
          !loading && (
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-400/20 transition hover:bg-emerald-400/15"
            >
              <span className="text-emerald-300">
                <ShopNavIcon name="account" />
              </span>
              Sign in with SMS
            </Link>
          )
        )}
      </div>
    </aside>
  );
}
