import { OrderSuccessClient } from "@/app/components/ui/OrderSuccessClient";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;
  return <OrderSuccessClient orderId={orderId} />;
}
