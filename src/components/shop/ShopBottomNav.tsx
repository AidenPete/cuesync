"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { ShopNavIcon, type ShopNavIconName } from "@/components/shop/ShopNavIcons";

export type ShopTab = {
  href: string;
  label: string;
  icon: ShopNavIconName;
  exact?: boolean;
  badge?: number;
  matchPaths?: string[];
};

function isTabActive(pathname: string, tab: ShopTab) {
  if (tab.matchPaths?.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }
  if (tab.exact) return pathname === tab.href;
  if (tab.href === "/login") return pathname.startsWith("/login");
  return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
}

function TabLink({ tab }: { tab: ShopTab }) {
  const pathname = usePathname();
  const active = isTabActive(pathname, tab);

  return (
    <Link
      href={tab.href}
      className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition ${
        active ? "text-emerald-300" : "text-emerald-100/55 hover:text-emerald-100/80"
      }`}
    >
      <span
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition ${
          active ? "bg-emerald-400/15 ring-1 ring-emerald-400/25" : ""
        }`}
      >
        <ShopNavIcon name={tab.icon} className="h-5 w-5" />
        {tab.badge !== undefined && tab.badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-[#062318]">
            {tab.badge}
          </span>
        )}
      </span>
      <span className="truncate">{tab.label}</span>
    </Link>
  );
}

function TabPlaceholder({ tab }: { tab: ShopTab }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium text-emerald-100/55">
      <span className="flex h-9 w-9 items-center justify-center">
        <ShopNavIcon name={tab.icon} className="h-5 w-5" />
      </span>
      <span>{tab.label}</span>
    </div>
  );
}

export function useShopTabs(): ShopTab[] {
  const { itemCount } = useCart();
  const { phone, loading } = usePhoneAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const tabs: ShopTab[] = [
    { href: "/", label: "Home", icon: "home", exact: true },
    { href: "/shop", label: "Shop", icon: "shop" },
    {
      href: "/cart",
      label: "Cart",
      icon: "cart",
      badge: mounted ? itemCount : 0,
    },
  ];

  if (mounted && !loading && phone) {
    tabs.push({ href: "/orders", label: "Orders", icon: "orders" });
  } else {
    tabs.push({ href: "/login", label: "Sign in", icon: "account" });
  }

  tabs.push({
    href: "/menu",
    label: "More",
    icon: "menu",
    matchPaths: ["/menu", "/contact", "/qr", "/account"],
  });

  return tabs;
}

export function ShopBottomNav() {
  const pathname = usePathname();
  const tabs = useShopTabs();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Shop navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#062318]/98 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {mounted
          ? tabs.map((tab) => <TabLink key={tab.href} tab={tab} />)
          : tabs.map((tab) => <TabPlaceholder key={tab.href} tab={tab} />)}
      </div>
    </nav>
  );
}
