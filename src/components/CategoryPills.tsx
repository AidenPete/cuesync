"use client";

import type { Category } from "@/lib/types";

type Props = {
  active: Category | "all";
  onChange: (category: Category | "all") => void;
  categories: { id: Category | "all"; label: string }[];
};

export function CategoryPills({ active, onChange, categories }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((category) => {
        const selected = active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              selected
                ? "bg-emerald-400 text-[#062318]"
                : "bg-white/10 text-emerald-100 hover:bg-white/15"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
