"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { slugifyProductId } from "@/lib/products";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Add product"
        description="Create a new item for the shop catalogue."
        backHref="/admin/products"
        backLabel="Products"
      />
      <ProductForm
        mode="create"
        onSubmit={async (payload) => {
          const response = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              id: payload.id || slugifyProductId(payload.name),
              image: payload.image || `/products/${payload.id || slugifyProductId(payload.name)}.jpg`,
              stock: payload.stock ?? 10,
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Could not create product.");
          router.push(`/admin/products/${data.product.id}`);
        }}
      />
    </div>
  );
}
