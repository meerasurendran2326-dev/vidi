"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled client error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020704] text-slate-100 px-6 text-center">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-rose-400/80 mb-3">
        Unexpected Interruption
      </p>
      <h1
        className="text-3xl sm:text-4xl font-normal text-white"
        style={{ fontFamily: "var(--font-editorial), serif" }}
      >
        Something Went Wrong
      </h1>
      <p className="mt-4 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
        We encountered a temporary error while loading this page. Please try refreshing or return to the main showroom.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="rounded-full bg-[#1fe0bb] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#03251c] transition-all hover:bg-emerald-200 shadow-lg shadow-[#1fe0bb]/20"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-emerald-900/40 bg-emerald-950/20 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 transition-all hover:border-[#1fe0bb]/40"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
