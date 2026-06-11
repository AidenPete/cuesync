"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminProductImage } from "@/components/admin/AdminProductImage";
import { ProductShopLink } from "@/components/admin/ProductShopLink";
import { StockBadge } from "@/components/StockBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatKes } from "@/lib/format";
import { adminButtonPrimary, adminButtonSecondary, adminCardClassName } from "@/lib/admin-ui";
import { getAvailability } from "@/lib/inventory";
import { getCategoryLabel } from "@/lib/products";
import type { Product } from "@/lib/types";

type StockFilter = "all" | "low_stock" | "out_of_stock" | "preorder_only";

const STOCK_FILTERS: { value: StockFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
  { value: "preorder_only", label: "Preorder only" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

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

  const counts = useMemo(
    () => ({
      all: products.length,
      low_stock: products.filter((p) => getAvailability(p) === "low_stock").length,
      out_of_stock: products.filter((p) => getAvailability(p) === "out_of_stock").length,
      preorder_only: products.filter((p) => p.preorderOnly).length,
    }),
    [products],
  );

  const filtered = products.filter((product) => {
    const query = search.trim().toLowerCase();
    if (query) {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.includes(query);
      if (!matchesSearch) return false;
    }

    if (stockFilter === "all") return true;
    if (stockFilter === "preorder_only") return product.preorderOnly;
    return getAvailability(product) === stockFilter;
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

      <div className="flex flex-wrap gap-2">
        {STOCK_FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setStockFilter(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              stockFilter === option.value
                ? "bg-emerald-400 text-[#062318]"
                : "bg-white/5 text-emerald-100/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {option.label}
            <span className="ml-1.5 opacity-70">({counts[option.value]})</span>
          </button>
        ))}
      </div>

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
          description="Add your first product or adjust your search and filters."
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
                  <StockBadge stock={product.stock} preorderOnly={product.preorderOnly} />
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
