"use client";

import { inputClassName } from "@/lib/ui";

export type SortOption = "featured" | "price-asc" | "price-desc" | "name";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  resultCount: number;
};

export function CatalogueToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  resultCount,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search products…"
        className={`${inputClassName} sm:max-w-sm`}
      />
      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="catalogue-sort">
          Sort products
        </label>
        <select
          id="catalogue-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="rounded-2xl border border-white/10 bg-[#041912] px-4 py-3 text-sm text-white outline-none ring-emerald-400/50 focus:ring-2"
        >
          <option value="featured">Featured first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
        <span className="text-sm text-emerald-100/50">{resultCount} items</span>
      </div>
    </div>
  );
}
