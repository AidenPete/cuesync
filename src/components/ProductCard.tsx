"use client";

import Link from "next/link";
import { ProductActions } from "@/components/ProductActions";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge } from "@/components/StockBadge";
import { formatKes } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/30">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <ProductImage
            product={product}
            className="relative h-full w-full"
            imageClassName="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062318]/80 via-transparent to-transparent" />
          <div className="absolute left-3 top-3">
            <StockBadge stock={product.stock} preorderOnly={product.preorderOnly} />
          </div>
          {product.featured && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-[#062318]">
              Popular
            </span>
          )}
        </div>

        <div className="space-y-2 p-5 pb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-emerald-100/70">
            {product.description}
          </p>
          <p className="text-xs font-medium text-emerald-400/80">View details →</p>
        </div>
      </Link>

      <div className="flex items-end justify-between gap-3 px-5 pb-5">
        <p className="text-xl font-bold text-emerald-300">
          {formatKes(product.price)}
        </p>
        <ProductActions product={product} />
      </div>
    </article>
  );
}
