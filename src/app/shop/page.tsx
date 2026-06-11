"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CategoryPills } from "@/components/CategoryPills";
import { ProductCard } from "@/components/ProductCard";
import {
  CatalogueToolbar,
  type SortOption,
} from "@/components/shop/CatalogueToolbar";
import { categories } from "@/lib/products";
import type { Category, Product } from "@/lib/types";

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = products;

    if (activeCategory !== "all") {
      list = list.filter((product) => product.category === activeCategory);
    }

    if (query) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    return sortProducts(list, sort);
  }, [products, activeCategory, search, sort]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/80">
          Catalogue
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Pool & billiard accessories
        </h1>
        <p className="max-w-2xl text-emerald-100/70">
          Tap an item for details, add to cart, then checkout with M-Pesa.
        </p>
      </div>

      <CategoryPills
        active={activeCategory}
        onChange={setActiveCategory}
        categories={categories}
      />

      <CatalogueToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      {loading ? (
        <p className="text-emerald-100/60">Loading catalogue…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-5xl">🔍</p>
          <h2 className="mt-4 text-xl font-semibold text-white">No products found</h2>
          <p className="mt-2 text-emerald-100/70">
            {search.trim()
              ? "Try a different search term or clear the search box."
              : "Nothing in this category right now. Browse all items instead."}
          </p>
          {(search.trim() || activeCategory !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-6 inline-flex rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Show all products
            </button>
          )}
          {!search.trim() && activeCategory === "all" && (
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-emerald-500 px-6 py-3 font-semibold text-[#062318] transition hover:bg-emerald-400"
            >
              Contact us
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
