"use client";

import { useEffect, useMemo, useState } from "react";
import { CustomerSmsComposer } from "@/components/admin/CustomerSmsComposer";
import { ProductShopLink } from "@/components/admin/ProductShopLink";
import {
  adminInputClassName,
  adminLabelClassName,
  adminCardClassName,
} from "@/lib/admin-ui";
import { buildWishlistProductSms, CATALOGUE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";

type Props = {
  phone: string;
  customerName: string;
};

export function CustomerProductSms({ phone, customerName }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [productId, products],
  );

  const initialMessage = selectedProduct
    ? buildWishlistProductSms(customerName, selectedProduct.name, selectedProduct.id)
    : `Hi ${customerName}, browse our catalogue at CueSync: ${CATALOGUE_URL}`;

  return (
    <section className={`${adminCardClassName} space-y-4 p-6`}>
      <div>
        <h2 className="text-xl font-bold text-white">Send product SMS</h2>
        <p className="mt-1 text-sm text-emerald-100/60">
          Pick a product to include its shop link in a custom SMS.
        </p>
      </div>

      <label className="block space-y-2">
        <span className={adminLabelClassName}>Product</span>
        <select
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          disabled={loading}
          className={adminInputClassName}
        >
          <option value="">
            {loading ? "Loading products…" : "Select a product…"}
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>

      {selectedProduct && <ProductShopLink productId={selectedProduct.id} />}

      <CustomerSmsComposer
        key={`${productId}-${customerName}`}
        phone={phone}
        productLabel={selectedProduct?.name}
        initialMessage={initialMessage}
        startOpen
        className="w-full"
      />
    </section>
  );
}
