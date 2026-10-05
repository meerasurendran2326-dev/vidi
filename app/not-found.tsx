import Link from "next/link";
import { SiteHeader } from "@/app/components/ui/SiteHeader";
import { FooterColumn } from "@/app/components/ui/FooterColumn";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#020704] text-slate-100">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#1fe0bb]/80 mb-3">
          404 · Piece Unseen
        </p>
        <h1
          className="text-4xl sm:text-5xl font-normal text-white"
          style={{ fontFamily: "var(--font-editorial), serif" }}
        >
          Lost to the Shadows
        </h1>
        <p className="mt-4 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
          The creation or page you are seeking could not be found in our atelier. It may have been archived or moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-[#1fe0bb] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-lg shadow-[#1fe0bb]/20"
          >
            Return to Atelier
          </Link>
          <Link
            href="/rings"
            className="rounded-full border border-emerald-900/40 bg-emerald-950/20 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 transition-all hover:border-[#1fe0bb]/40"
          >
            Explore Collections
          </Link>
        </div>
      </main>
      <FooterColumn />
    </div>
  );
}
