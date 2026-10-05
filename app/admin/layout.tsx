import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/app/lib/auth";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020704] text-slate-100">
      {/* Sidebar */}
      <AdminSidebar adminEmail={admin.email} adminName={admin.fullName} />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-emerald-900/40 bg-[#020704]/90 px-3.5 sm:px-6 backdrop-blur-md">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1fe0bb]/70">
            Admin Console
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-500">
              {admin.email}
            </span>
            <Link
              href="/"
              className="rounded-full border border-emerald-800/50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-300 transition-colors hover:border-[#1fe0bb]/60 hover:text-[#1fe0bb]"
            >
              ← Store
            </Link>
          </div>
        </header>

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
