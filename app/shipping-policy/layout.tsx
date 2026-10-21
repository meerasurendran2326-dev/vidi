import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Information on insured worldwide and domestic shipping, transit times, packaging, and dispatch procedures for VINI VICI VIDI jewellery orders.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
