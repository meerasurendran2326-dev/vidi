import Link from "next/link";
import { FooterColumn } from "@/app/components/ui/FooterColumn";
import { SiteHeader } from "@/app/components/ui/SiteHeader";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020704] text-slate-100">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-20 text-center">
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            VINI VICI VIDI · Silver Atelier
          </p>
          <h1
            className="mt-4 text-4xl font-semibold text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            Piece not found
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100/75">
            This creation may have moved from the collection.
          </p>
          <Link
            href="/rings"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300/35 bg-emerald-700 px-6 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-emerald-600"
          >
            Explore the collection
          </Link>
        </div>
      </main>
      <FooterColumn />
    </div>
  );
}
