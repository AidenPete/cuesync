import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

/** Legacy redirect — orders are tracked via SMS link at /track/[token] */
export default async function OrderSuccessPage({ searchParams }: Props) {
  await searchParams;
  redirect("/shop");
}
