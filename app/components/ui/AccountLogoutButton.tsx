"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AccountLogoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-rose-200 transition-all hover:border-rose-400 hover:bg-rose-900/40 hover:text-white disabled:opacity-50 ${className}`}
    >
      <LogOut className="h-3.5 w-3.5" />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
