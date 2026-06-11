"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLoading } from "@/components/admin/AdminLoading";
import {
  AdminNavIcon,
  type AdminNavIconName,
} from "@/components/admin/AdminNavIcons";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (!data.authenticated) {
          const next = encodeURIComponent(pathname);
          router.replace(`/admin/login?next=${next}`);
          return;
        }
        setReady(true);
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <AdminLoading label="Checking admin session…" />
      </div>
    );
  }

  return <>{children}</>;
}

export const adminNavItems: {
  href: string;
  label: string;
  icon: AdminNavIconName;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/products", label: "Products", icon: "products" },
  { href: "/admin/orders", label: "Orders", icon: "orders" },
  { href: "/admin/delivery", label: "Delivery", icon: "delivery" },
  { href: "/admin/customers", label: "Customers", icon: "customers" },
  { href: "/admin/preorders", label: "Preorders", icon: "preorders" },
];

export function AdminNavLink({
  href,
  label,
  icon,
  exact = false,
  compact = false,
}: {
  href: string;
  label: string;
  icon: AdminNavIconName;
  exact?: boolean;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 whitespace-nowrap rounded-full font-medium transition ${
        compact ? "px-3 py-2 text-xs" : "gap-3 rounded-2xl px-4 py-3 text-sm"
      } ${
        active
          ? "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-400/20"
          : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center ${
          active ? "text-emerald-300" : "text-emerald-100/50"
        }`}
      >
        <AdminNavIcon name={icon} className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </span>
      {label}
    </Link>
  );
}
