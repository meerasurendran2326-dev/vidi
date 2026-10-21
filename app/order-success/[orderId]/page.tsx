import type { Metadata } from "next";
import { OrderSuccessClient } from "@/app/components/ui/OrderSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmation | VINI VICI VIDI",
  robots: {
    index: false,
    follow: false,
  },
};

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;
  return <OrderSuccessClient orderId={orderId} />;
}
