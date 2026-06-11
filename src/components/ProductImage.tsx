import Image from "next/image";
import type { Product } from "@/lib/types";

type Props = {
  product: Pick<Product, "name" | "image">;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function ProductImage({
  product,
  className = "relative h-full w-full",
  imageClassName = "object-cover transition duration-300 group-hover:scale-105",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: Props) {
  return (
    <div className={className}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority={priority}
        sizes={sizes}
        className={imageClassName}
      />
    </div>
  );
}
