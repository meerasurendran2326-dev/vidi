import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Atelier Client Services",
  description:
    "Connect with the VINI VICI VIDI atelier for bespoke jewellery inquiries, sizing assistance, orders, and silver care consultations.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Atelier Client Services | VINI VICI VIDI",
    description:
      "Connect with the VINI VICI VIDI atelier for bespoke jewellery inquiries, sizing assistance, orders, and silver care consultations.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
