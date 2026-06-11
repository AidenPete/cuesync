"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";

type Props = {
  product: Pick<Product, "name" | "image">;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function AdminProductImage({
  product,
  className = "relative h-full w-full",
  imageClassName = "object-cover",
  priority = false,
  sizes = "(max-width: 640px) 100vw, 33vw",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!product.image || failed) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center gap-2 bg-[#062318] text-emerald-100/40`}
      >
        <span className="text-3xl">🖼️</span>
        <p className="text-xs">No image</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority={priority}
        sizes={sizes}
        className={imageClassName}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
