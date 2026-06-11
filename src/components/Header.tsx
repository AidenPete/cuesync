import Link from "next/link";
import { CartButton } from "@/components/CartButton";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#062318]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-lg shadow-lg shadow-emerald-900/40">
            🎱
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              {SITE_NAME}
            </p>
            <p className="text-xs text-emerald-200/70">Pool & Billiard Gear</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-emerald-100/80 sm:flex">
          <Link href="/shop" className="transition hover:text-white">
            Catalogue
          </Link>
          <Link href="/qr" className="transition hover:text-white">
            Share QR
          </Link>
        </nav>

        <CartButton />
      </div>
    </header>
  );
}
