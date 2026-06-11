"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { ShopNavIcon, type ShopNavIconName } from "@/components/shop/ShopNavIcons";

type Tab = {
  href: string;
  label: string;
  icon: ShopNavIconName;
  exact?: boolean;
  badge?: number;
};

function TabLink({ tab }: { tab: Tab }) {
  const pathname = usePathname();
  const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

  return (
    <Link
      href={tab.href}
      className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium transition ${
        active ? "text-emerald-300" : "text-emerald-100/55"
      }`}
    >
      <span className="relative">
        <ShopNavIcon name={tab.icon} className="h-5 w-5" />
        {tab.badge !== undefined && tab.badge > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-[#062318]">
            {tab.badge}
          </span>
        )}
      </span>
      <span className="truncate">{tab.label}</span>
    </Link>
  );
}

export function ShopMobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { phone, loading } = usePhoneAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const authTab: Tab = {
    href: phone ? "/orders" : "/login",
    label: phone ? "Account" : "Sign in",
    icon: "account",
    exact: !phone,
  };

  const tabs: Tab[] = [
    { href: "/", label: "Home", icon: "home", exact: true },
    { href: "/shop", label: "Shop", icon: "shop" },
    {
      href: "/cart",
      label: "Cart",
      icon: "cart",
      badge: mounted ? itemCount : 0,
    },
    authTab,
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#062318]/98 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {mounted && !loading
          ? tabs.map((tab) => <TabLink key={tab.href + tab.label} tab={tab} />)
          : tabs.map((tab) => (
              <div
                key={tab.label}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium text-emerald-100/55"
              >
                <ShopNavIcon name={tab.icon} className="h-5 w-5" />
                <span>{tab.label}</span>
              </div>
            ))}
      </div>
    </nav>
  );
}
