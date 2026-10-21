import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track the real-time shipping and delivery status of your handcrafted VINI VICI VIDI jewellery package.",
  alternates: {
    canonical: "/track-order",
  },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
