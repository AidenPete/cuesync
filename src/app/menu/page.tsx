"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePhoneAuth } from "@/components/PhoneAuthProvider";
import { ShopNavIcon } from "@/components/shop/ShopNavIcons";
import { SITE_NAME } from "@/lib/site";

type MenuLink = {
  href: string;
  label: string;
  description: string;
  icon: "orders" | "account" | "qr" | "menu" | "shop" | "help";
  external?: boolean;
};

function MenuItem({ item }: { item: MenuLink }) {
  const className =
    "flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-400/30 hover:bg-white/[0.07]";

  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
        <ShopNavIcon name={item.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-white">{item.label}</span>
        <span className="block text-sm text-emerald-100/60">{item.description}</span>
      </span>
      <span className="text-emerald-100/40">→</span>
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

export default function MenuPage() {
  const pathname = usePathname();
  const { phone, loading, logout } = usePhoneAuth();

  const links: MenuLink[] = [
    ...(phone
      ? [
          {
            href: "/account",
            label: "Your account",
            description: "Profile and order summary",
            icon: "account" as const,
          },
          {
            href: "/orders",
            label: "My orders",
            description: "Track deliveries and receipts",
            icon: "orders" as const,
          },
        ]
      : [
          {
            href: "/login",
            label: "Sign in",
            description: "Verify your phone to see orders",
            icon: "account" as const,
          },
        ]),
    { href: "/qr", label: "Share shop QR", description: "Print or download for customers", icon: "qr" },
    { href: "/contact", label: "Contact & help", description: "WhatsApp, phone, and email", icon: "help" },
    { href: "/shop", label: "Browse catalogue", description: "All pool & billiard gear", icon: "shop" },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
          Menu
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">{SITE_NAME}</h1>
        <p className="mt-2 text-emerald-100/70">Quick links and support.</p>
      </div>

      <nav className="space-y-3" aria-label="Shop menu">
        {links.map((item) => (
          <MenuItem key={item.href + item.label} item={item} />
        ))}
      </nav>

      {!loading && phone && (
        <button
          type="button"
          onClick={() => logout()}
          className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-emerald-100/60 transition hover:bg-white/5 hover:text-white"
        >
          Sign out
        </button>
      )}

      {pathname.startsWith("/menu") && (
        <p className="text-center text-xs text-emerald-100/40 md:hidden">
          Tip: use the bottom bar for Home, Shop, and Cart.
        </p>
      )}
    </div>
  );
}
