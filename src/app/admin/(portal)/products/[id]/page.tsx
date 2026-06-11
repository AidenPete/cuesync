"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data.product ?? null);
        if (data.product) setImage(data.product.image);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const saveImage = useCallback(
    async (path: string) => {
      if (!product) return;
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: path }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save image.");
      setProduct(data.product);
      setImage(data.product.image);
    },
    [product],
  );

  if (loading) return <AdminLoading />;
  if (!product) return <p className="text-red-200">Product not found.</p>;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Catalogue"
        title={product.name}
        description={`Edit product details and image · ${product.id}`}
        backHref="/admin/products"
        backLabel="Products"
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(280px,380px)_1fr]">
        <div className="xl:sticky xl:top-8 xl:self-start">
          <ProductImageUpload
            value={image}
            onChange={setImage}
            productId={product.id}
            productName={product.name}
            autoSave
            onAutoSave={saveImage}
          />
        </div>

        <ProductForm
          mode="edit"
          initial={product}
          image={image}
          onImageChange={setImage}
          hideImage
          onImageAutoSave={saveImage}
          onSubmit={async (payload) => {
            const response = await fetch(`/api/admin/products/${product.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Could not save.");
            setProduct(data.product);
            setImage(data.product.image);
          }}
          onDelete={async () => {
            const response = await fetch(`/api/admin/products/${product.id}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || "Could not delete.");
            }
            router.push("/admin/products");
          }}
        />
      </div>
    </div>
  );
}
