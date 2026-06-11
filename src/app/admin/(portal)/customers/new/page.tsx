"use client";

import { useRouter } from "next/navigation";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { normalizePhone } from "@/lib/format";

export default function NewCustomerPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AdminPageHeader
        eyebrow="People"
        title="Add customer"
        description="Create a customer profile to track details and send product SMS."
        backHref="/admin/customers"
        backLabel="Customers"
      />

      <CustomerForm
        mode="create"
        onSubmit={async (values) => {
          const response = await fetch("/api/admin/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...values,
              phone: normalizePhone(values.phone),
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Could not create customer.");
          }
          router.push(`/admin/customers/${encodeURIComponent(data.customer.phone)}`);
        }}
      />
    </div>
  );
}
