"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Chatbot } from "@/components/Chatbot";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PwaRegister } from "@/components/PwaRegister";
import { ShopBottomNav } from "@/components/shop/ShopBottomNav";
import { ShopDesktopSidebar } from "@/components/shop/ShopDesktopSidebar";
import { ShopTopHeader } from "@/components/shop/ShopTopHeader";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
  { href: "/qr", label: "QR code" },
  { href: "/orders", label: "Orders" },
];

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-dvh bg-[#041912]">
        <ShopDesktopSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <ShopTopHeader />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8">
            {children}
          </main>

          <footer className="border-t border-white/10 px-4 py-6 pb-24 text-center md:pb-6">
            <nav
              aria-label="Footer"
              className="mx-auto mb-4 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
            >
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-emerald-100/50 transition hover:text-emerald-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-sm text-emerald-100/50">
              © {new Date().getFullYear()} {SITE_NAME} · {SITE_DOMAIN}
            </p>
          </footer>
        </div>
      </div>

      <ShopBottomNav />
      <Chatbot />
      <InstallPrompt />
      <PwaRegister />
    </>
  );
}
