import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { ProductImage } from "@/components/ProductImage";
import { StockBadge } from "@/components/StockBadge";
import { getCategoryLabel } from "@/lib/products";
import { getProductById } from "@/lib/product-db";
import { formatKes } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/shop"
        className="inline-flex text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
      >
        ← Back to catalogue
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10">
          <ProductImage
            product={product}
            className="relative h-full w-full"
            imageClassName="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.featured && (
            <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-[#062318]">
              Popular
            </span>
          )}
          <div className="absolute left-4 top-4">
            <StockBadge stock={product.stock} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-200">
              {getCategoryLabel(product.category)}
            </span>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {product.name}
            </h1>
            <p className="text-lg text-emerald-100/80">{product.description}</p>
            <p className="text-3xl font-bold text-emerald-300">
              {formatKes(product.price)}
            </p>
          </div>

          <ProductActions product={product} size="lg" />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold text-white">Details</h2>
            <ul className="mt-3 space-y-2">
              {product.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-2 text-sm text-emerald-100/80"
                >
                  <span className="text-emerald-400">✓</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-emerald-100/50">
            Pay with M-Pesa at checkout. Delivery to your location after
            payment.
          </p>
        </div>
      </div>
    </div>
  );
}
