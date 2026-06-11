"use client";

import { useMemo, useState } from "react";
import { CategoryPills } from "@/components/CategoryPills";
import { ProductCard } from "@/components/ProductCard";
import { categories, getProductsByCategory } from "@/lib/products";
import type { Category } from "@/lib/types";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const products = useMemo(
    () => getProductsByCategory(activeCategory),
    [activeCategory],
  );

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
          Tap a category, add items to your cart, then checkout with M-Pesa.
        </p>
      </div>

      <CategoryPills
        active={activeCategory}
        onChange={setActiveCategory}
        categories={categories}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
