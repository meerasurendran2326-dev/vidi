"use client";

import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F9F6F1] text-[#0B4A3B]">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <FooterColumn />
    </div>
  );
}
