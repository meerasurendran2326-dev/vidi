"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Gem,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

interface AdminSidebarProps {
  adminEmail: string;
  adminName: string;
}

export function AdminSidebar({ adminEmail, adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Horizontal Navigation Bar (< lg) */}
      <div className="lg:hidden w-full border-b border-emerald-900/40 bg-[#010d08] px-3 py-2.5 overflow-x-auto min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-max">
          <div className="flex items-center gap-1.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-all ${
                    active
                      ? "bg-[#1fe0bb]/15 text-[#1fe0bb] border border-[#1fe0bb]/30"
                      : "text-slate-400 hover:text-slate-100 bg-white/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-rose-400 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-950/40 transition-colors shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isLoggingOut ? "..." : "Sign Out"}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (lg+) */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-emerald-900/40 bg-[#010d08] min-h-screen">
        {/* Brand */}
        <div className="flex h-14 items-center gap-2.5 border-b border-emerald-900/40 px-5">
          <Gem className="h-4 w-4 text-[#1fe0bb]" />
          <span
            className="text-sm font-normal tracking-widest text-white"
            style={{ fontFamily: "var(--font-editorial), serif" }}
          >
            VINI VICI VIDI
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-all ${
                  active
                    ? "bg-[#1fe0bb]/10 text-[#1fe0bb] shadow-inner shadow-[#1fe0bb]/5"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? "text-[#1fe0bb]" : "text-slate-500"}`}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-emerald-900/30 p-4 space-y-2">
          <div className="px-1">
            <p className="text-[0.65rem] font-semibold text-white/80 truncate">{adminName}</p>
            <p className="text-[0.6rem] text-slate-500 truncate">{adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-rose-400 transition-all hover:bg-rose-950/30 hover:text-rose-300 disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isLoggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
