"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminProductImage } from "@/components/admin/AdminProductImage";
import { ProductShopLink } from "@/components/admin/ProductShopLink";
import { StockBadge } from "@/components/StockBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatKes } from "@/lib/format";
import { adminButtonPrimary, adminButtonSecondary, adminCardClassName } from "@/lib/admin-ui";
import { getAvailability, LOW_STOCK_THRESHOLD } from "@/lib/inventory";
import { getCategoryLabel } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function removeProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  const filtered = products.filter((product) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query) ||
      product.category.includes(query)
    );
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Manage your shop inventory — changes appear on the storefront immediately."
        action={
          <Link href="/admin/products/new" className={adminButtonPrimary}>
            + Add product
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products…"
          className="w-full max-w-md rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white outline-none ring-emerald-400/50 placeholder:text-white/30 focus:ring-2"
        />
        <span className="text-sm text-emerald-100/50">{filtered.length} items</span>
      </div>

      {loading ? (
        <AdminLoading label="Loading products…" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          emoji="🎱"
          title="No products found"
          description="Add your first product or adjust your search."
          action={
            <Link href="/admin/products/new" className={adminButtonPrimary}>
              Add product
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <article
              key={product.id}
              className={`${adminCardClassName} group overflow-hidden transition hover:-translate-y-0.5 hover:border-emerald-400/30`}
            >
              <Link
                href={`/admin/products/${product.id}`}
                className="relative block h-44 overflow-hidden"
                title="View and change image"
              >
                <AdminProductImage
                  product={product}
                  className="relative h-full w-full"
                  imageClassName="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062318]/90 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  Change photo
                </span>
                {product.featured && (
                  <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-[#062318]">
                    Popular
                  </span>
                )}
              </Link>
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-300/70">
                    {getCategoryLabel(product.category)} · {product.stock} in stock
                  </p>
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="line-clamp-2 text-sm text-emerald-100/70">{product.description}</p>
                </div>
                <p className="text-xl font-bold text-emerald-300">{formatKes(product.price)}</p>
                <ProductShopLink productId={product.id} compact />
                <div className="flex items-center gap-2">
                  <StockBadge stock={product.stock} />
                  {getAvailability(product) === "low_stock" && (
                    <span className="text-xs text-amber-200">Low stock</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/products/${product.id}`} className={adminButtonPrimary}>
                    Edit
                  </Link>
                  <a
                    href={`/shop/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={adminButtonSecondary}
                  >
                    Shop ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id, product.name)}
                    className="rounded-full px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
