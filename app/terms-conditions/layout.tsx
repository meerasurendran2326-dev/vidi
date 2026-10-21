import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms of service, sales terms, intellectual property, and atelier order policies for VINI VICI VIDI Pure 925 Silver.",
  alternates: {
    canonical: "/terms-conditions",
  },
};

export default function TermsConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
