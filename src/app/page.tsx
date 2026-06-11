import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { formatKes } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0b4a33] via-[#062318] to-[#041912]">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative grid lg:grid-cols-2">
          <div className="space-y-6 px-6 py-14 sm:px-12 sm:py-20">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-emerald-200">
              Cues · Balls · Chalk · Table care
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Your pool shop,
              <span className="block text-emerald-300">in your pocket.</span>
            </h1>
            <p className="max-w-lg text-lg text-emerald-100/75">
              {SITE_NAME} stocks premium billiard accessories — from pro maple
              cues to Aramith ball sets. Browse the catalogue, build your cart,
              and pay securely with M-Pesa.
            </p>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { label: "12+ products", detail: "Curated gear" },
                { label: "M-Pesa", detail: "Fast checkout" },
                { label: "Mobile-first", detail: "Shop anywhere" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-lg font-bold text-white">{item.label}</p>
                  <p className="text-sm text-emerald-200/60">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/shop"
                className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-[#062318] transition hover:bg-emerald-300"
              >
                Browse catalogue
              </Link>
              <Link
                href="/qr"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Share shop QR
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px] lg:min-h-full">
            <Image
              src="/hero/pool-table.jpg"
              alt="Pool table with cues and balls"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#062318] via-[#062318]/40 to-transparent lg:from-[#062318]/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041912]/60 to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured gear</h2>
            <p className="text-emerald-100/70">Top picks from the catalogue</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-emerald-300">
            View all →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <Link
              key={product.id}
              href="/shop"
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-emerald-400/30"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062318]/90 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-emerald-100/70">
                  {product.description}
                </p>
                <p className="mt-3 font-bold text-emerald-300">
                  {formatKes(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
